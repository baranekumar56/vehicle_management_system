
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.package.Package import Package
from sqlalchemy import text

async def package_state_changer(ids:list[int], new_state: bool, db:AsyncSession):
    
    res = await db.execute(text("SELECT * FROM package_batch_state_change(:ids, :new_state)", 
                                {"ids", ids, "new_state", new_state}))
    
    res = res.rowcount
    return res

