
from fastapi import Request, Depends
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
from app.auth.jwt_bearer import JWTBearer


class AuthorizationMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        # this middleware checks whether the incoming request have an authorization header 
        # this middleware skips routes for /login or /signup or /

        public_paths = [
            '/', '/users/login', '/users/signup', '/secure-data',
            '/docs', '/docs/oauth2-redirect', '/openapi.json', '/redoc'
        ]
        url = request.url.path

        if url in public_paths:
            # skip and move to the end point
            return await call_next(request) 
        
        jwt_bearer = JWTBearer()
        await jwt_bearer(request)
        
        return await call_next(request)
        
