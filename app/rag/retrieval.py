import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import DocumentVector
from app.ingestion.embedder import embed_chunks

async def retrieve_relevant_chunks(
    db: AsyncSession, tenant_id: uuid.UUID, query: str, top_k: int = 5
) -> list[DocumentVector]:
    query_embedding = embed_chunks([query])[0]

    stmt = (
        select(DocumentVector)
        .where(DocumentVector.tenant_id == tenant_id)
        .order_by(DocumentVector.embedding.cosine_distance(query_embedding))
        .limit(top_k)
    )

    result = await db.execute(stmt)
    return result.scalars().all()