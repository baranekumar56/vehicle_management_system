
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.package.Package import Package
from sqlalchemy import text

async def delete_availability_in_availability_cache(shed_id: int, db: AsyncSession):

    query = text("DELETE FROM availabilitycache WHERE shed_id = :shed_id")

    res = await db.execute(query, {"shed_id": shed_id})

    return res.rowcount