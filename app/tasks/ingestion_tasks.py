import asyncio
import uuid
from app.tasks.celery_app import celery_app
from app.db.postgres import async_session
from app.db.models import DocumentVector
from app.ingestion.chunker import chunk_text
from app.ingestion.embedder import embed_chunks


@celery_app.task(name="process_document")
def process_document_task(tenant_id: str, document_id: str, text: str) -> dict:
    return asyncio.run(_process_document(tenant_id, document_id, text))


async def _process_document(tenant_id: str, document_id: str, text: str) -> dict:
    chunks = chunk_text(text)
    embeddings = embed_chunks(chunks)

    async with async_session() as session:
        for chunk, embedding in zip(chunks, embeddings):
            vector_row = DocumentVector(
                tenant_id=uuid.UUID(tenant_id),
                document_id=uuid.UUID(document_id),
                chunk_text=chunk,
                embedding=embedding,
            )
            session.add(vector_row)

        await session.commit()

    return {"chunks_created": len(chunks)}