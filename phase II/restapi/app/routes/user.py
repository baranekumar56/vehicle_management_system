
from fastapi import APIRouter, Query, Form, File, Request, UploadFile, Depends, HTTPException, Response
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import select, update, insert
from app.auth.jwt_handler import create_access_token, create_refresh_token, verify_password, hash_password, verify_token
from app.schema.user import User, UserCreate, UserLoginRequest, MechanicCreate, Mechanic as ModelMechanic, MechanicDBInsert
from app.models.user.User import Users as DBUser
from app.models.user.User import Mechanic
from sqlalchemy.exc import IntegrityError
from app.schema.user_vehicle import UserVehicle as ModelUserVehicle, UserVehicleCreate as ModelUserVehicleCreate
from app.models.user.User import UserVehicle
from app.auth.jwt_bearer import JWTBearer
from app.database.database import schedule_settings
from uuid import uuid1
from app.database.database import blacklist

from app.crud.user import *
from app.crud.generic import *



class MechanicSchedule:

    mechanic_id:int 
    job_queue: list[list[int]]
    bookings : list[list[int]] # booking id, scheulde id

    def __init__(self, mechanic_id, job_queue, bookings):
        self.mechanic_id = mechanic_id
        self.job_queue = job_queue
        self.bookings = bookings

    def to_dict(self) -> dict:
        return {
            "mechanic_id": self.mechanic_id,
            "job_queue": self.job_queue,
            "bookings": self.bookings
        }



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
            payload['token_id'] = uuid1()

            tokens = [payload['token_id']]

            access_token = create_access_token(payload=payload)
            payload["token_id"] = uuid1()
            tokens.append(payload['token_id'])
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
        payload['token_id'] = uuid1()

        tokens = [payload['token_id']]

        access_token = create_access_token(payload=payload)
        payload["token_id"] = uuid1()
        tokens.append(payload['token_id'])
        refresh_token = create_refresh_token(payload=payload)

            
            
        response.set_cookie('refresh_token', str(refresh_token) )

        return {"msg": "user added successfully", "data" : user, "access_token": access_token}
    
    except IntegrityError as e:
        print(str(e))
        raise HTTPException(status_code=461, detail='User email already exists')
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=400, detail={"msg": "unexpected error occured", "detail": str(e)})

@router.get('/log_out')
async def log_out_user(request: Request, payload = Depends(JWTBearer())):

    try:

        refresh_token = verify_token(request.cookies.get('refresh_token'))

        if refresh_token is None:
            raise HTTPException(status_code=403, detail="unauthorized user")
        
        if payload is None:
            raise HTTPException(status_code=403, detail="unauthorized access, access token missing")

        # add the tokens to black list
        tokens = [{"_id":refresh_token['token_id']}, {"_id":payload['token_id']}]

        await blacklist.insert_many(tokens)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occured during log out, {str(e)}")



# @router.get('/users')
# async def filter_users(filters :  = Body):
#     pass


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
    
# mechanic

@router.post('/mechanic/add_mechanic')
async def add_mechanic(mechanic: MechanicCreate, db:AsyncSession = Depends(get_db)):

    try :

        # first add him to the table as a user
        # then using his user_id, set as mechanic id

        user = UserCreate.model_validate(mechanic.model_dump())

        user:DBUser = await add_entry(DBUser, user, db )

        mechanic = MechanicDBInsert(**mechanic.model_dump(), mechanic_id=user.user_id)
        # print(mechanic.model_dump())
        # add mechanic

        mechanic = await add_entry(Mechanic, mechanic, db )
        # now add him to available mechanics in scheduling

        doc = await schedule_settings.find_one({})
        mech = MechanicSchedule(mechanic_id=mechanic.mechanic_id, job_queue=[], bookings=[]).to_dict()
        doc['available_mechanics'].append(mech)

        await schedule_settings.find_one_and_update({"_id": doc['_id']}, {"$set": {"available_mechanics":doc['available_mechanics'] }})



        await commit_changes(db)

        return {"msg": "mechanic added successfully", "mechanic_id": mechanic}
        

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create new mechanic, {str(e)}")

@router.patch('/mechanic/update_status')
async def update_status_of_mechanic(mechanic_id: int, status: str, db:AsyncSession = Depends(get_db)):
    
    try:
        # check if id exists
        mechanic = await check_if_id_exists(mechanic_id, Mechanic, db)

        if mechanic is None:
            raise HTTPException(status_code=404, detail="Mechanic id not found")

        updated_row_count = await update_mechanic_status(mechanic_id=mechanic_id, status=status,db= db)

        return {"msg" :"mechanic status updated successfully"}

    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update mechanic status, {str(e)}")


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