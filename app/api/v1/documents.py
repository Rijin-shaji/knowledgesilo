import uuid
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import Tenant, DocumentVector
from app.core.dependencies import get_current_tenant
from app.ingestion.loaders.txt_loader import load_txt
from app.ingestion.loaders.pdf_loader import load_pdf
from app.ingestion.loaders.docx_loader import load_docx
from app.tasks.ingestion_tasks import process_document_task

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

    return {
        "document_id": str(document_id),
        "filename": file.filename,
        "status": "processing",
    }