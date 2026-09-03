import uuid
from fastapi import APIRouter, UploadFile, File, Depends ,HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import Tenant, DocumentVector
from app.core.dependencies import get_current_tenant
from app.ingestion.loaders.txt_loader import load_txt
from app.ingestion.loaders.pdf_loader import load_pdf
from app.ingestion.loaders.docx_loader import load_docx
from app.tasks.ingestion_tasks import process_document_task
from datetime import datetime, timezone
from app.db.models.mongo_collections import document_metadata_collection
from sqlalchemy import delete
from pydantic import BaseModel
from app.ingestion.loaders.url_loader import load_url

router = APIRouter()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    file_bytes = await file.read()

    if file.filename.endswith(".pdf"):
        text = load_pdf(file_bytes)
    elif file.filename.endswith(".docx"):
        text = load_docx(file_bytes)
    else:
        text = load_txt(file_bytes)

    document_id = uuid.uuid4()

    process_document_task.delay(
        tenant_id=str(tenant.id),
        document_id=str(document_id),
        text=text,
    )

    await document_metadata_collection.insert_one({
        "document_id": str(document_id),
        "tenant_id": str(tenant.id),
        "filename": file.filename,
        "uploaded_at": datetime.now(timezone.utc),
    })

    return {
        "document_id": str(document_id),
        "filename": file.filename,
        "status": "processing",
    }

class UploadUrlRequest(BaseModel):
    url: str


@router.post("/upload-url")
async def upload_document_from_url(
    body: UploadUrlRequest,
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    text = await load_url(body.url)

    if not text:
        return {"error": "Could not extract readable content from that URL."}

    document_id = uuid.uuid4()

    await document_metadata_collection.insert_one({
        "document_id": str(document_id),
        "tenant_id": str(tenant.id),
        "filename": body.url,
        "uploaded_at": datetime.now(timezone.utc),
    })

    process_document_task.delay(
        tenant_id=str(tenant.id),
        document_id=str(document_id),
        text=text,
    )

    return {
        "document_id": str(document_id),
        "filename": body.url,
        "status": "processing",
    }

@router.get("/")
async def list_documents(tenant: Tenant = Depends(get_current_tenant)):
    cursor = document_metadata_collection.find({"tenant_id": str(tenant.id)})
    documents = await cursor.to_list(length=100)

    return [
        {
            "document_id": doc["document_id"],
            "filename": doc["filename"],
            "uploaded_at": doc["uploaded_at"].isoformat(),
        }
        for doc in documents
    ]

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    doc_uuid = uuid.UUID(document_id)

    await db.execute(
        delete(DocumentVector).where(
            DocumentVector.document_id == doc_uuid,
            DocumentVector.tenant_id == tenant.id,
        )
    )
    await db.commit()

    await document_metadata_collection.delete_one(
        {"document_id": document_id, "tenant_id": str(tenant.id)}
    )

    return {"document_id": document_id, "status": "deleted"}