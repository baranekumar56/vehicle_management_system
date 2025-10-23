
from fastapi import FastAPI, Depends
from sqlalchemy import select, update, delete, insert
from app.schema.service import Service, ServiceCreate
from app.schema.mech_note import MechNote, MechNoteCreate
from app.models.services.Service import Service
from app.database import get_db, init_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.database import mech_notes




app = FastAPI()

@app.on_event('startup')
async def load_tables():
    await init_db()

@app.post('/add_service')
async def add_service(service:ServiceCreate, db:Session = Depends(get_db)):
    service = Service(**service.model_dump())
    db.add(service)
    await db.commit()
    return {"msg": "nalladhae nadanthirukku"}

@app.get('/get_services')
async def get_all_service(db:AsyncSession = Depends(get_db)):

    result = await db.execute(select(Service))
    services = []

    for service in result.scalars():
        services.append(service)
    return {"services": services}

@app.post('/add_mech_note', response_model=MechNote)
async def add_mech_note(mech_note: MechNoteCreate):
    
    mech_note = await mech_notes.insert_one(mech_note.model_dump())
    print(mech_note)
    mech_note = await mech_notes.find_one({"_id": mech_note.inserted_id})
    mech_note['_id'] = str(mech_note['_id'])
    return MechNote(**mech_note)