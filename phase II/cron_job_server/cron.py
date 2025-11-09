
from fastapi import FastAPI, Request, Response
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

app = FastAPI()


engine = create_engine()
sessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():

    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.post('/add_cron_job')
def add_cron_job(request:Request, response: Response):

    # the body contains date and required sequel to run

    body = request.json()

    timestamp = body.timestamp
    query = body.query

    