

from starlette.middleware.base import BaseHTTPMiddleware
from app.database.database import user_activity_log
import uuid
from datetime import datetime
import asyncio
from time import time

class Logger(BaseHTTPMiddleware):

    async def log_event(self, doc: dict):

        await user_activity_log.insert_one(doc)

    async def dispatch(self, request, call_next):
        
        # this logger logs on the log.txt file 
        # main contents taken from request are, 
        #       -> route, user id (skipped if going to /, /login or /signup) , time of arrival, uuid , response status, if 500 or 404 or 400 any in lookfor list , log as error with the error

        doc = {}

        start_time = datetime.now()

        auth = request.headers.get('auth')
        doc['user_id'] = auth['user_id']
        doc['url'] = request.url.path
        doc['request_id'] = str(uuid.uuid1())
        request.headers['request_id'] = doc['request_id']
        doc['route'] = request.url.path
        doc['type'] = "entry"
        doc['timestamp'] = str(datetime.now())

        asyncio.create_task(self.log_event(doc.copy()))

        response = await call_next(request)
        end_time = datetime.now()
        doc['type'] = "exit"
        doc['timestamp'] = str(datetime.now())
        doc['response_status_code'] = response.status_code
        doc['response_time'] = end_time - start_time
        
        asyncio.create_task(self.log_event(doc.copy()))

        return response
        


    
