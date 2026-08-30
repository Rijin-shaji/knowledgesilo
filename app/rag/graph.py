import uuid
from typing import TypedDict
from sqlalchemy.ext.asyncio import AsyncSession
from app.rag.retrieval import retrieve_relevant_chunks
from app.rag.llm import generate_answer


class RAGState(TypedDict):
    tenant_id: uuid.UUID
    query: str
    db: AsyncSession
    chunks: list
    answer: str
    citations: list[dict]


async def retrieve_node(state: RAGState) -> RAGState:
    chunks = await retrieve_relevant_chunks(
        db=state["db"], tenant_id=state["tenant_id"], query=state["query"]
    )
    state["chunks"] = chunks
    return state

async def generate_node(state: RAGState) -> RAGState:
    chunk_texts = [c.chunk_text for c in state["chunks"]]
    answer = generate_answer(query=state["query"], context_chunks=chunk_texts)

    citations = [
        {
            "document_id": str(c.document_id),
            "chunk_id": str(c.id),
            "preview": c.chunk_text[:150],
        }
        for c in state["chunks"]
    ]

    state["answer"] = answer
    state["citations"] = citations
    return state

from langgraph.graph import StateGraph, END

workflow = StateGraph(RAGState)
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("generate", generate_node)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

rag_graph = workflow.compile()