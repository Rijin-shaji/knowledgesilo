from fastapi import Depends, HTTPException, Header, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.db.models import ApiKey, Tenant
from app.core.security import verify_api_key
from app.core.rate_limit import check_rate_limit
from fastapi import Request
from app.db.models import UsageLog
from app.core.security import decode_access_token

async def get_current_tenant(
    request: Request,
    x_api_key: str | None = Header(None, alias="X-API-Key"),
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db),
) -> Tenant:
    tenant = None
    matched_key = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
        tenant_id = decode_access_token(token)
        if tenant_id:
            tenant = await db.get(Tenant, tenant_id)

    if tenant is None and x_api_key:
        result = await db.execute(select(ApiKey).where(ApiKey.is_active == True))
        api_keys = result.scalars().all()

        for key_record in api_keys:
            if verify_api_key(x_api_key, key_record.key_hash):
                matched_key = key_record
                break

        if matched_key:
            await check_rate_limit(str(matched_key.id))
            tenant = await db.get(Tenant, matched_key.tenant_id)

    if tenant is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing credentials",
        )

    route = request.scope.get("route")
    endpoint_path = route.path if route else request.url.path

    usage_row = UsageLog(
        tenant_id=tenant.id,
        api_key_id=matched_key.id if matched_key else None,
        endpoint=f"{request.method} {endpoint_path}",
    )
    db.add(usage_row)
    await db.commit()

    return tenant