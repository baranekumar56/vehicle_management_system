
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

async def check_if_id_exists(id: int, table_type, db:AsyncSession):
    """
    This function returns the object or none, be carefull dont expect true or false
    """
    id_name = f"{table_type.__tablename__}_id"

    id_column = getattr(table_type, id_name)

    res = await  db.execute(select(table_type).where(id_column == id))
    res = res.scalar_one_or_none()
    return res

