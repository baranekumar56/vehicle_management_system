

from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.inventory.Inventory import Inventory, UsedItem
from app.schema.inventory import ProductCreate, Product, NeededItem as ModelNeededItem , NeededItemCreate, RequirementUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.crud.generic import *

router = APIRouter()

@router.post('/add_item_to_inventory')
async def add_an_item_to_inventory(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    
    # check if the product already exists
    try:
        
        prod = await check_if_entry_exists(Inventory, db, name = product.name)

        if prod is None:
            raise HTTPException(status_code=400, detail="Duplicate product already exists")
        
        product = await add_entry(Inventory, product, db)

        await commit_changes(db)

        return {"msg": "product added successfully", "product" : Product.model_validate(product)}

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add product to inventory, {str(e)}")
    

@router.patch('/update_product_details')
async def update_product_details(inventory_id: int, quantity: int , db:AsyncSession = Depends(get_db) ):

    try :
        # check if exists

        product = await check_if_id_exists(inventory_id, Inventory, db)

        if product is None:
            raise HTTPException(detail="Product not found", status_code=404)

        

        await update_entry_by_id(Inventory, id=inventory_id, quantity = quantity)
        await commit_changes(db)
        return {"msg", "Product details updated successfully"}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occured during product detail update, {str(e)}")

@router.delete('/delete_product')
async def delete_inventory_product(inventory_id:int, db:AsyncSession = Depends(get_db)):
    
    try :
        # check if exists

        product = await check_if_id_exists(inventory_id, Inventory, db)

        if product is None:
            raise HTTPException(detail="Product not found", status_code=404)

        await delete_multiple_entries_using_id(Inventory, [inventory_id], db)
        await commit_changes(db)

        return {"msg", "prouct deleted successfully"}

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occured during product delete, {str(e)}")

@router.post('/add_needed_items')
async def add_needed_items_for_booking(requirements: list[RequirementUpdate], db:AsyncSession = Depends(get_db)):

    # the thing here is if the requirement pair already exists for a booking id, then update its price
    pass