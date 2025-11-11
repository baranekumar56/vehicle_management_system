

from app.schema.inventory import RequirementUpdate
from app.models.inventory.Inventory import Inventory, NeededItem
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends

async def update_requirement_details(requirements: list[RequirementUpdate], db:AsyncSession ):


    select(Inventory)
    # inventory_products = await 
    query = """

        DO $$ 
        DECLARE
            rec RECORD;
        BEGIN

            -- select each row and lock it , till update gets done
            FOR SELECT * FROM inventory 
            

    """