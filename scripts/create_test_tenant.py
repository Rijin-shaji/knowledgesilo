import asyncio
from app.db.postgres import async_session
from app.db.models import Tenant, ApiKey
from app.core.security import generate_api_key, hash_api_key


async def main():
    async with async_session() as session:
        tenant = Tenant(name="Test Company", email="test@example.com")
        session.add(tenant)
        await session.flush()  # assigns tenant.id without fully committing yet

        raw_key = generate_api_key()
        api_key = ApiKey(tenant_id=tenant.id, key_hash=hash_api_key(raw_key))
        session.add(api_key)

        await session.commit()

        print("Tenant ID:", tenant.id)
        print("Raw API key (save this, it won't be shown again):", raw_key)


if __name__ == "__main__":
    asyncio.run(main())