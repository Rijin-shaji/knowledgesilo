from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.postgres import get_db
from app.db.models import Tenant, UsageLog
from app.core.dependencies import get_current_tenant

router = APIRouter()


@router.get("/")
async def get_usage(
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    total_stmt = select(func.count(UsageLog.id)).where(UsageLog.tenant_id == tenant.id)
    total_result = await db.execute(total_stmt)
    total_requests = total_result.scalar()

    breakdown_stmt = (
        select(UsageLog.endpoint, func.count(UsageLog.id))
        .where(UsageLog.tenant_id == tenant.id)
        .group_by(UsageLog.endpoint)
    )
    breakdown_result = await db.execute(breakdown_stmt)
    breakdown = [{"endpoint": row[0], "count": row[1]} for row in breakdown_result.all()]

    return {
        "total_requests": total_requests,
        "by_endpoint": breakdown,
    }