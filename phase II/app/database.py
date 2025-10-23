from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


# postgres 
engine = create_async_engine(settings.DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

#mongodb
URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(URL)

mongodb_database = client.get_database('vsms')

mech_notes = mongodb_database.get_collection('mech_notes')


async def init_db():
    import app.models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with SessionLocal() as session:
        yield session
