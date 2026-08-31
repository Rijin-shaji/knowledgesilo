from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_db
from app.db.models import Tenant, ApiKey
from app.core.dependencies import get_current_tenant
from app.core.security import generate_api_key, hash_api_key

router = APIRouter()


class CreateApiKeyRequest(BaseModel):
    name: str
    purpose: str


@router.post("/")
async def create_api_key(
    body: CreateApiKeyRequest,
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    raw_key = generate_api_key()

    api_key = ApiKey(
        tenant_id=tenant.id,
        key_hash=hash_api_key(raw_key),
        name=body.name,
        purpose=body.purpose,
        key_suffix=raw_key[-4:],
    )
    db.add(api_key)
    await db.commit()

    return {"api_key": raw_key, "message": "Save this key now — it will not be shown again."}


@router.get("/")
async def list_api_keys(
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ApiKey).where(ApiKey.tenant_id == tenant.id).order_by(ApiKey.created_at.desc())
    )
    keys = result.scalars().all()

    return [
        {
            "id": str(k.id),
            "name": k.name,
            "purpose": k.purpose,
            "key_suffix": k.key_suffix,
            "is_active": k.is_active,
            "created_at": k.created_at.isoformat(),
        }
        for k in keys
    ]