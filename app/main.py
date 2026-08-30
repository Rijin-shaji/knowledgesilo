from fastapi import FastAPI
from sqlalchemy import text
from app.db.postgres import engine
from app.db.mongo import mongo_db
from fastapi import Depends
from app.core.dependencies import get_current_tenant
from app.db.models import Tenant
from app.api.v1.documents import router as documents_router
from app.api.v1.query import router as query_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="KnowledgeSilo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    # Check Postgres
    async with engine.connect() as conn:
        await conn.execute(text("SELECT 1"))

    # Check MongoDB
    await mongo_db.command("ping")

    return {"status": "ok", "postgres": "connected", "mongo": "connected"}


@app.get("/me")
async def read_current_tenant(tenant: Tenant = Depends(get_current_tenant)):
    return {"tenant_id": str(tenant.id), "name": tenant.name, "email": tenant.email}


app.include_router(documents_router, prefix="/api/v1/documents", tags=["documents"])

app.include_router(query_router, prefix="/api/v1/query", tags=["query"])