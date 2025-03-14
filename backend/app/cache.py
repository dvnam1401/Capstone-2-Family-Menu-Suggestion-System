import redis.asyncio as redis
from dotenv import load_dotenv
import os

load_dotenv()
redis_client = redis.from_url(os.getenv("REDIS_URL"))

async def set_cache(key: str, value, expire: int = 300):
    await redis_client.setex(key, expire, str(value))

async def get_cache(key: str):
    return await redis_client.get(key) 