

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt_handler import verify_token

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):

        # print(request.headers['authorization'].split(' '))
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        # print(credentials)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            payload = verify_token(credentials.credentials)
            if payload is None:
                raise HTTPException(status_code=403, detail="Invalid or expired token.")
            return payload
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

