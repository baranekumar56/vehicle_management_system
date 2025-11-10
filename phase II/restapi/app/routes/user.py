
from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select, update, insert
from app.auth.jwt_handler import create_access_token, create_refresh_token, verify_password, hash_password
from app.schema.user import User, UserCreate, UserLoginRequest
from sqlalchemy.exc import IntegrityError
from app.schema.user_vehicle import UserVehicle as ModelUserVehicle, UserVehicleCreate as ModelUserVehicleCreate
from app.models.user.User import UserVehicle
from app.auth.jwt_bearer import JWTBearer

from app.crud.user import *
from app.crud.generic import *

router = APIRouter()


@router.post('/login')
async def login(
        response : Response,
        user_request : UserLoginRequest,
        db:AsyncSession = Depends(get_db)
        ):
    
    # check whether the user is available in the table
    try :
        user: User = await check_if_user_exists(user_request.user_email, db)

        if user is None:
            raise HTTPException(status_code=461, detail="User email not found, please create an account")
        
        # hashed_password = hash_password(password=password)

        # verify the password 
        if ( verify_password( user_request.password, user.password )):
            # Then the password is a match
            # So we return here stating that in a middleware or depends function we set the cookie in it
            # In order to do that we need to set the cookie on to the response 

            user = user.model_dump()
            payload = {}
            payload['user_name'] = user['user_name']
            payload['user_email'] = user['user_email']
            payload["user_id"] = user['user_id']
            payload['role_id'] = user['role_id']


            access_token = create_access_token(payload=payload)
            refresh_token = create_refresh_token(payload=payload)
            
            response.set_cookie('refresh_token', str(refresh_token) )

            return {"msg": "Authentication Successfull!!!", "access_token": access_token}    

        else :
            raise HTTPException(status_code=461, detail="Password didn't match")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail={"msg": "unexpected error occured", "detail": str(e)})



@router.post('/signup')
async def signup(response: Response, user: UserCreate, db:AsyncSession = Depends(get_db)):
    
    # in signup we get the user details , then directly call the underlying crud function
    try:

        # also need to check if the user already exists

        user = await create_user(user, db)

        user = user.model_dump()
        payload = {}
        payload['user_name'] = user['user_name']
        payload['user_email'] = user['user_email']
        payload["user_id"] = user['user_id']
        payload['role_id'] = user['role_id']

        access_token = create_access_token(payload=payload)
        refresh_token = create_refresh_token(payload=payload)
            
        response.set_cookie('refresh_token', str(refresh_token) )

        return {"msg": "user added successfully", "data" : user, "access_token": access_token}
    
    except IntegrityError as e:
        print(str(e))
        raise HTTPException(status_code=461, detail='User email already exists')
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=400, detail={"msg": "unexpected error occured", "detail": str(e)})


@router.get('/filter')
async def filter_users():
    pass


@router.patch('/deactivate_user/{user_id}')
async def deactivate_user(response: Response, user_id: int, db:AsyncSession = Depends(get_db)):
    
    user = await check_if_user_exists(user_id=user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="user with id {user_id} not found")
    
    res = await activate_deactivate_user(user_id=user_id, activate=False)

    if res :
        response.status_code = 200
        return {"msg": "User status updated successfully"}
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}


@router.patch('/activate_user/{user_id}')
async def activate_user(response: Response, user_id: int, db:AsyncSession = Depends(get_db)):
    
    user = await check_if_user_exists(user_id=user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="user with id {user_id} not found")
    
    res = await activate_deactivate_user(user_id=user_id, activate=True)

    if res :
        response.status_code = 200
        return {"msg": "User status updated successfully"}
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}
    

# vehicles

user_vehicle_router = APIRouter()

@user_vehicle_router.post('/add_vehicle')
async def add_vehicle_to_user(response: Response,user_vehicle: ModelUserVehicleCreate, db:AsyncSession = Depends(get_db), payload = Depends(JWTBearer())):
    try:
        print(payload)
        exists: UserVehicle = await check_if_entry_exists(UserVehicle, db,user_id = payload['user_id'], vehicle_no=user_vehicle.vehicle_no, owned = True)
        print("1")
        if exists is not None:
            if exists.is_deleted:
                affected_rows = await update_entry_by_id(UserVehicle, exists.user_vehicle_id, db, is_deleted=False)
                print(2)
            else:
                raise HTTPException(status_code=400, detail="Vehicle already exists")
        else:
            user_vehicle = await add_entry(UserVehicle, user_vehicle, db)

            print(3)
        
        await commit_changes(db)

        return {"msg": "Operation successful", "data": ModelUserVehicle.model_validate(user_vehicle) if exists is None else None}

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    except Exception as e:
        t = str(e)
        raise HTTPException(status_code=500, detail="Failed to add vehicle, reason =>{}".format(t))
    
@user_vehicle_router.patch('/select_vehicle')
async def select_user_vehicle_id(resposne: Response, user_vehicle_id: int = Query(...), db:AsyncSession = Depends(get_db), payload = Depends(JWTBearer())):

    try :
        
        # check if the user vehicle exists
        exists = await check_if_entry_exists(table_class=UserVehicle, db=db, user_vehicle_id=user_vehicle_id)
        
        if exists is None:
            print("here")
            raise HTTPException(status_code=404, detail="Vehicle not found")
        # start transaction

            # unset the vehicle which is already selected
        previous_vehicle:UserVehicle = await check_if_entry_exists(UserVehicle, db,user_id = payload['user_id'], selected = True )
        print("here")
        if previous_vehicle is None:

            # set the current user vehicle to be selected
            await update_entry_by_id(UserVehicle, user_vehicle_id, db, selected = True)
            print("1")
        
        else :
            # then set the previous one as unselected and current as selected
            await update_entry_by_id(UserVehicle, previous_vehicle.user_vehicle_id, db, selected = False)
            await update_entry_by_id(UserVehicle, user_vehicle_id, db, selected = True)
            print("2")
        
        await commit_changes(db)

            
        return {"msg": "Vehicle selection done successfully"} 
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    except Exception as e:
        t = str(e)
        print(t)
        raise HTTPException(status_code=500, detail="Vehicle selection failed {}".format(t))


@user_vehicle_router.get('/selected_vehicle')
async def get_selected_vehicle_for_autocomplete(db:AsyncSession = Depends(get_db), payload = Depends(JWTBearer())):

    # we return if there exists a selected vehicle for user if not then raise HTTP 404 error

    record = await check_if_entry_exists(UserVehicle, db, user_id = payload['user_id'], selected = True)
    if record is None:
        raise HTTPException(status_code=404, detail="No vehicle have been selected")
    
    
    return {"data": ModelUserVehicle.model_validate(record)}

@router.delete('/delete_vehicle')
async def delete_user_vehicle(user_vehicle_id : int = Query(), db:AsyncSession = Depends(get_db), payload = Depends(JWTBearer())):

    # check whether the vehicle first exists

    record = await check_if_entry_exists(UserVehicle, db, user_vehicle_id = user_vehicle_id)

    if record is None:
        raise HTTPException(status_code=404, detail="No vehicle found for vehicle id: {user_vehicle_id}")
    
    try:
            
        await update_entry_by_id(UserVehicle, user_vehicle_id, db, is_deleted = True)

        await commit_changes(db)

        return {"msg": "vehicle deleted successfully"}
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    except Exception as e:
        raise e


router.include_router(user_vehicle_router, prefix='/vehicles', tags=['User Vehicles'])