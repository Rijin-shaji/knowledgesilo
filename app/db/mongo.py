from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

mongo_client = AsyncIOMotorClient(settings.mongo_url)
mongo_db = mongo_client.get_default_database()