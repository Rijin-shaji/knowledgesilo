from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import Tenant
from app.core.dependencies import get_current_tenant
from app.rag.graph import rag_graph
from fastapi.responses import StreamingResponse
from app.rag.retrieval import retrieve_relevant_chunks
from app.rag.llm import generate_answer_stream

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

@router.post("/stream")
async def query_documents_stream(
    body: QueryRequest,
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    chunks = await retrieve_relevant_chunks(db=db, tenant_id=tenant.id, query=body.question)
    chunk_texts = [c.chunk_text for c in chunks]

    async def event_generator():
        for token in generate_answer_stream(body.question, chunk_texts):
            yield f"data: {token}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")