

from sqlalchemy.types import UserDefinedType
# from app.models.user.User import Address
from dataclasses import dataclass


# iam declaring the address type for refernce of mine i can still de clare this in another file , but i am lazy as shit, i can keep up with this
@dataclass
class Address:
    street : str
    area : str
    district : str
    state: str
    country : str
    pincode : str 


class AddressType(UserDefinedType):

    def get_col_spec(self, **kw):
        return "address_type"
    
    def bind_processor(self, dialect):
        
        def process(value):
            if value is None:
                return None
            print(value)
            return (value.street, value.area, value.district, value.state, value.country, value.pincode)
        
        return process
    
    def result_processor(self, dialect, coltype):
        
        def process(value):

            if value is None:
                return None
            
            street, area, district, state, country, pincode = value.strip("()").split(',')
            return Address(street=street, area=area, district=district, state=state, country=country, pincode=pincode)
        
        return process