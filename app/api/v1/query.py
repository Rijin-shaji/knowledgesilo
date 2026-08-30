from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import Tenant
from app.core.dependencies import get_current_tenant
from app.rag.graph import rag_graph

router = APIRouter()


class QueryRequest(BaseModel):
    question: str


@router.post("/")
async def query_documents(
    body: QueryRequest,
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    result = await rag_graph.ainvoke({
        "tenant_id": tenant.id,
        "query": body.question,
        "db": db,
        "chunks": [],
        "answer": "",
        "citations": [],
    })

    return {
        "answer": result["answer"],
        "citations": result["citations"],
    }