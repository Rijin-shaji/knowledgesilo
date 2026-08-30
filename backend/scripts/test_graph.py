import asyncio
import uuid
from app.db.postgres import async_session
from app.rag.graph import rag_graph

TEST_TENANT_ID = uuid.UUID("50dd9e42-1211-41a2-9f51-310c39a24f35")


async def main():
    async with async_session() as session:
        result = await rag_graph.ainvoke({
            "tenant_id": TEST_TENANT_ID,
            "query": "What does the Customer Team do?",
            "db": session,
            "chunks": [],
            "answer": "",
            "citations": [],
        })

        print("ANSWER:")
        print(result["answer"])
        print()
        print("CITATIONS:")
        for c in result["citations"]:
            print(c)


if __name__ == "__main__":
    asyncio.run(main())