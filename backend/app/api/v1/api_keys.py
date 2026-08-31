from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import Tenant, ApiKey
from app.core.dependencies import get_current_tenant
from app.core.security import generate_api_key, hash_api_key

router = APIRouter()


@router.post("/")
async def create_api_key(
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    raw_key = generate_api_key()

    api_key = ApiKey(tenant_id=tenant.id, key_hash=hash_api_key(raw_key))
    db.add(api_key)
    await db.commit()

    return {"api_key": raw_key, "message": "Save this key now — it will not be shown again."}