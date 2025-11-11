
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from app.models.payment.Payment import Payment
from app.schema.payment import PaymentCreate, Payment as ModelPayment
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.crud.generic import *

router = APIRouter()

@router.post('/create_payment')
async def create_a_payment_log_for_a_booking(payment: PaymentCreate, db:AsyncSession = Depends(get_db)):
    
    try :
        
        payment = await add_entry(Payment, payment, db)

        await commit_changes(db)

        return {"msg": "payment added successfully", "payment_details": ModelPayment.model_validate(payment)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to log payment,{str(e)} ")
    
@router.get('/get_payment_details')
async def get_payment_details_for_booking(booking_id: int, db:AsyncSession = Depends(get_db)):

    try:
        
        payments = await get_entries(Payment, db, booking_id = booking_id)

        payments = [ModelPayment.model_validate(payment) for payment in payments ]

        return payments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get payment details, {str(e)}")
