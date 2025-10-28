
from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select, update, insert
from app.auth.jwt_handler import create_access_token, create_refresh_token, verify_password, hash_password
from app.schema.user import User, UserCreate, UserLoginRequest
from sqlalchemy.exc import IntegrityError
from app.schema.user_vehicle import UserVehicle, UserVehicleCreate

from app.crud.user import *

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
            refresh_token = create_refresh_token()
            
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
        user = await create_user(user, db)

        user = user.model_dump()
        payload = {}
        payload['user_name'] = user['user_name']
        payload['user_email'] = user['user_email']
        payload["user_id"] = user['user_id']
        payload['role_id'] = user['role_id']

        access_token = create_access_token(payload=payload)
        refresh_token = create_refresh_token()
            
        response.set_cookie('refresh_token', str(refresh_token) )

        return {"msg": "user added successfully", "data" : user, "access_token": access_token}
    
    except IntegrityError as e:
        raise HTTPException(status_code=461, detail='User email already exists')
    except Exception as e:
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

@router.post('/add_vehicle')
async def add_vehicle_to_user(response: Response,user_vehicle: UserVehicleCreate, db:AsyncSession = Depends(get_db) ):
    
    return user_vehicle

