import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_me_endpoint_rejects_missing_key():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/me")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_me_endpoint_rejects_invalid_key():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/me", headers={"X-API-Key": "not_a_real_key"})
    assert response.status_code == 401