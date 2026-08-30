import redis.asyncio as redis
from fastapi import HTTPException, status
from app.config import settings

redis_client = redis.from_url(settings.redis_url, decode_responses=True)

RATE_LIMIT_REQUESTS = 20
RATE_LIMIT_WINDOW_SECONDS = 60

async def check_rate_limit(api_key_id: str) -> None:
    key = f"rate_limit:{api_key_id}"
    current = await redis_client.incr(key)

    if current == 1:
        await redis_client.expire(key, RATE_LIMIT_WINDOW_SECONDS)

    if current > RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: max {RATE_LIMIT_REQUESTS} requests per {RATE_LIMIT_WINDOW_SECONDS} seconds",
        )