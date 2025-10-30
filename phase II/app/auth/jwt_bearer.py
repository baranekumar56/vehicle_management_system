

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt_handler import verify_token

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        public_paths = [
            '/', '/users/login', '/users/signup', '/secure-data',
            '/docs', '/docs/oauth2-redirect', '/openapi.json', '/redoc'
        ]
        url = request.url.path

        # Skip token verification for public paths
        if url in public_paths:
            return None  # No authentication needed for these routes

        # For secured routes, proceed with token verification
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if credentials.scheme != "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            payload = verify_token(credentials.credentials)
            if payload is None:
                raise HTTPException(status_code=403, detail="Invalid or expired token.")
            return payload
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")
