

from fastapi import HTTPException

class Authenticator:

    required_roles = []

    def __init__(self, role ):
        self.required_roles.append(role)

    
class RequiredAdminPrivilege(Authenticator):

    __role = "admin"

    def __init__(self):
        super().__init__(self.role)

    def __call__(self, request):
        
        # assuming the header have a thing called header.auth

        current_role = request.headers.get('auth')['role']

        if current_role not in self.required_roles:
            raise HTTPException(status_code=403, detail="UnAuthorized access")

        return
    
class RequiredCustomerPrivilege(Authenticator):

    __role = "customer"

    def __init__(self):
        super().__init__(self.role)

    def __call__(self, request):
        
        # assuming the header have a thing called header.auth

        current_role = request.headers.get('auth')['role']

        if current_role not in self.required_roles:
            raise HTTPException(status_code=403, detail="UnAuthorized access")

        return
    
class RequiredMechanicPrivilege(Authenticator):

    __role = "mechanic"

    def __init__(self):
        super().__init__(self.role)

    def __call__(self, request):
        
        # assuming the header have a thing called header.auth

        current_role = request.headers.get('auth')['role']

        if current_role not in self.required_roles:
            raise HTTPException(status_code=403, detail="UnAuthorized access")

        return
    
class RequiredAdminOrMechanicPrivilege(RequiredAdminPrivilege, RequiredMechanicPrivilege):

    def __init__(self):
        super().__init__()

    def __call__(self, request):
        
        super().__call__(request)
        
        return
class RequiredAdminOrCustomerPrivilege(RequiredAdminPrivilege, RequiredCustomerPrivilege):

    def __init__(self):
        super().__init__()

    def __call__(self, request):
        
        super().__call__(request)
        
        return
    
class RequiredMechanicOrCustomer(RequiredMechanicPrivilege, RequiredCustomerPrivilege):

    def __init__(self):
        super().__init__()

    def __call__(self, request):
        
        super().__call__(request)
        
        return