import asyncio
import uuid
from app.db.postgres import async_session
from app.rag.retrieval import retrieve_relevant_chunks

TEST_TENANT_ID = uuid.UUID("50dd9e42-1211-41a2-9f51-310c39a24f35")  # your test tenant

async def main():
    async with async_session() as session:
        results = await retrieve_relevant_chunks(
            db=session,
            tenant_id=TEST_TENANT_ID,
            query="What does the Customer Team do?",
        )

        for i, chunk in enumerate(results, start=1):
            print(f"--- Result {i} ---")
            print(chunk.chunk_text[:150])
            print()

if __name__ == "__main__":
    asyncio.run(main())