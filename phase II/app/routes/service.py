
from fastapi import APIRouter, Depends, HTTPException, Response
from app.schema.service import ServiceCreate
from app.models.services_vehicles.Service import Service
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.crud.service import check_service_exists, activate_deactivate_service

router = APIRouter()

@router.post('/add_service')
async def add_service(service:ServiceCreate, db:AsyncSession = Depends(get_db)):
    service = Service(**service.model_dump())
    db.add(service)
    await db.commit()
    return {"msg": "nalladhae nadanthirukku"}

@router.get('/get_services')
async def get_all_service(db:AsyncSession = Depends(get_db)):

    result = await db.execute(select(Service))
    services = []

    for service in result.scalars():
        services.append(service)
    return {"services": services}


@router.patch('/deactivate_service/{service_id}')
async def deactivate_service(response: Response, serivce_id: int):
    
    service = await check_service_exists(service_id=serivce_id)

    if service is None:
        raise HTTPException(status_code=404, detail="service with id {service_id} not found")
    
    res = await activate_deactivate_service(service_id=serivce_id, activate=False)

    if res :
        response.status_code = 200
        return {"msg": "Service status updated successfully"}
    else :
        response.status_code = 400
        return {"msg": "Service status update failed"}


@router.patch('/activate_service/{service_id}')
async def deactivate_service(response: Response, serivce_id: int):
    
    service = await check_service_exists(service_id=serivce_id)

    if service is None:
        raise HTTPException(status_code=404, detail="service with id {service_id} not found")
    
    res = await activate_deactivate_service(service_id=serivce_id, activate=True)

    if res :
        response.status_code = 200
        return {"msg": "Service status updated successfully"}
    else :
        response.status_code = 400
        return {"msg": "Service status update failed"}



# @router.post('/add_mech_note', response_model=MechNote)
# async def add_mech_note(mech_note: MechNoteCreate):
    
#     mech_note = await mech_notes.insert_one(mech_note.model_dump())
#     print(mech_note)
#     mech_note = await mech_notes.find_one({"_id": mech_note.inserted_id})
#     mech_note['_id'] = str(mech_note['_id'])
#     return MechNote(**mech_note)