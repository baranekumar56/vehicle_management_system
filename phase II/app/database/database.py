from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker, declarative_base
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.custom_db_types.custom_types import enums, composites
from sqlalchemy.sql import text
from app.database.constraints import constraints
# postgres 
engine = create_async_engine(settings.DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

#mongodb
URL = "mongodb://localhost:27017"

client = AsyncIOMotorClient(URL)

mongodb_database = client.get_database('vsms')

mech_notes = mongodb_database.get_collection('mech_notes')


# Before executing the creation of all the tables lets 
# first run the code to execute all the user defined 
# types or custom types




async def init_db():
    import app.models

    # for now i have only one composite type lets run that string

    async with engine.begin() as conn:
        for custom_type in composites:
            await conn.execute(text(custom_type))

        for enumeration in enums:
            await conn.execute(text(enumeration))

        # create all tables
        # await conn.run_sync(Base.metadata.drop_all)

        await conn.run_sync(Base.metadata.create_all)

        # bind all the constraints to the associative table

        for constraint in constraints:
            await conn.execute(text(constraint))


async def get_db():
    async with SessionLocal() as session:
        yield session
