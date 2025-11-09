
from fastapi import WebSocket, WebSocketDisconnect

import json
from datetime import datetime

class ConnectionManager:

    def __init__(self):
        self.customers = dict()
        self.mechanics = dict()
        
    async def connect(self, user_id:int,role_id: int, websocket: WebSocket):

        await websocket.accept()

        if role_id == 2: # mech
            self.mechanics.setdefault(user_id, websocket)
        else:
            self.customers.setdefault(user_id, websocket)

    def disconnect(self, user_id: int):

        if user_id in self.customers:
            del self.customers[user_id]
        
        if user_id in self.mechanics:
            del self.mechanics[user_id]

    async def send_safe(self, user_id: int, content: str, heartbeat: bool = False):

        socket:WebSocket = None

        if user_id in self.mechanics:
            socket = self.mechanics[user_id]
        
        if user_id in self.customers:
            socket = self.customers[user_id]

        if user_id:
            
            try :

                data = {"content": content, "heartbeat": heartbeat}
                await socket.send_json(data)

            except Exception as e:
                print(f"User {user_id} has been disconnected {datetime.now()}")
                self.disconnect(user_id=user_id)


    async def send_notification(self, user_ids : list[int] , content: str):

        """we can call this function with specified id's based on that notification will be sent"""

        for user_id in user_ids:
            await self.send_safe(user_id=user_id, content=content)

        pass

    async def send_grouped_notification(self, group_id: int, content: str, heartbeat: bool = False):
        """this sends notification to all the members inside a group"""
        
        users = None
        if group_id == 1:
            users = self.mechanics.keys()
        elif group_id == 2:
            users = self.customers.keys()
        else:
            users = self.customers.keys().extend(self.mechanics.keys())

        for user_id in users:
            await self.send_safe(user_id=user_id, content=content, heartbeat=heartbeat)


connection_manager = ConnectionManager()