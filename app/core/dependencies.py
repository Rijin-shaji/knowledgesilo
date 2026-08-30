from fastapi import Depends, HTTPException, Header, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import ApiKey, Tenant
from app.core.security import verify_api_key
from app.core.rate_limit import check_rate_limit

async def get_current_tenant(
    x_api_key: str = Header(..., alias="X-API-Key"),
    db: AsyncSession = Depends(get_db),
) -> Tenant:
    result = await db.execute(select(ApiKey).where(ApiKey.is_active == True))
    api_keys = result.scalars().all()

    matched_key = None
    for key_record in api_keys:
        if verify_api_key(x_api_key, key_record.key_hash):
            matched_key = key_record
            break

    if matched_key is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )

    await check_rate_limit(str(matched_key.id))

    tenant = await db.get(Tenant, matched_key.tenant_id)
    return tenant