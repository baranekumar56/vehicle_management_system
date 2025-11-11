
from fastapi import HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.user import User, UserCreate
from sqlalchemy import select, update, insert
from app.models.user.User import Users
from app.custom_db_types.custom_db_classes import Address
from app.auth.jwt_handler import hash_password
from app.schema.user import Address as DataclassAddress
from datetime import datetime
from app.grpc_stubs.grpc_client import *
from app.crud.generic import *
from app.models.user.User import Mechanic

async def check_if_user_exists( user_email: str , db: AsyncSession) -> None | User :

    # load the user record
    result = await db.execute(select(Users).where(user_email == Users.user_email))

    user = result.scalar_one_or_none()

    if user is None:
        return None
    
    return User.model_validate(user)


async def create_user(user : UserCreate, db: AsyncSession) :

    user_data = user.model_dump()
    user_data["password"] = hash_password(password=user_data["password"])

    # Convert address to dataclass
    address_obj = DataclassAddress(**user_data["address"]) if isinstance(user_data["address"], dict) else DataclassAddress(**user_data["address"].model_dump())
    user_data["address"] = address_obj

    user_add = Users(**user_data, profile_picture="", id_picture="")
    db.add(user_add)
    await db.commit()
    await db.refresh(user_add)
    
    return User.model_validate(user_add)

async def activate_deactivate_user(user_id: int,db: AsyncSession, activate: bool = True):

    # if activate is true set the service to true else dont
    try:
        if activate:
            await db.execute(update(Users).where(Users.user_id == user_id).values(active=True))
        else :
            await db.execute(update(Users).where(Users.user_id == user_id).values(active = False, last_deactivated = datetime.now()))
        
        await db.commit()

        return True
    
    except Exception as e:
        return False
    

async def update_mechanic_status(mechanic_id: int, status: str, db:AsyncSession):

    # when any status arrives update the grpc server
    try:
    # make changes on mechanic table first

    # check if it exists
        mechanic = await check_if_entry_exists(Mechanic, db, mechanic_id = mechanic_id)
        if mechanic is None:
            raise HTTPException(status_code=404, detail="mechanic id not found")
        updated_row_count = await update_entry_by_id(Mechanic, id=mechanic_id, db=db, status=status)

        if updated_row_count <= 0:
            raise HTTPException(status_code=500, detail="Failed to updated mechanic status")
        
        # now signal the grpc
        
        res = await update_mech_status(stub=stub, mech_id=mechanic_id, status=status)

    
        await commit_changes(db)

        return updated_row_count
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update mechanic status, aborting")


