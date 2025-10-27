from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel
from fastapi import HTTPException, UploadFile, File
from datetime import datetime

"""
This file desrcibes about all the user pydantic models that we gonna use in our project
"""

from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr
from typing import Optional

class Role(BaseModel):

    role_name : str
    role_id : int

class Address(BaseModel):

    street : str
    area : str
    district : str
    state: str
    country : str
    pincode : str 

    model_config = ConfigDict(from_attributes=True)


    @field_validator('street')
    def street_validation(cls, street: str) -> str:

        street = street.strip()
        street = street.replace('"', '')

        if len(street) > 50 or len(street) < 3:
            raise ValueError("Street name should be less than 50 and greater than 3")
        
        return street
    
    @field_validator('area')
    def area_validation(cls, area: str) -> str:
        
        area = area.strip()
        area = area.replace('"', '')


        if len(area) > 50 or len(area) < 3:
            raise ValueError("Area name should be less than 50 and greater than 3")
        
        return area
    
    @field_validator('district')
    def district_validation(cls, district: str) -> str:
        
        district = district.strip()
        district = district.replace('"', '')

        if len(district) > 50 or len(district) < 3:
            raise ValueError("District name should be less than 50 and greater than 3")
        
        return district
    
    @field_validator('state')
    def state_validation(cls, state: str) -> str:
        
        state = state.strip()
        state = state.replace('"', '')
        

        if len(state) > 25 or len(state) < 3:
            raise ValueError("State name should be less than 25 and greater than 3")
        
        return state
    
    @field_validator('country')
    def country_validation(cls, country: str) -> str:
        
        country = country.strip()
        country = country.replace('"', '')
        

        if len(country) > 25 or len(country) < 3:
            raise ValueError("Country name should be less than 25 and greater than 3")
        
        return country
    
    @field_validator('pincode')
    def pincode_validation(cls, pincode: str) -> str:
        
        pincode = pincode.strip()
        pincode = pincode.replace('"', '')
        
        if len(pincode) != 6:
            raise ValueError("Pincode length should be 6")
        
        return pincode
 
class UserCreate(BaseModel):


    user_name : str
    user_email : EmailStr
    password : str
    address : Address
    phone : str
    # profile_picture : str
    # id_picture : str   # i will comment this because in fast using the fileupload type i can get that directly there , 
                        # then insert that into the db (means the meta data for it ), then set the url on to the actual user object
    role_id : int = Field(..., ge=0)
    joined_on : datetime = Field(default_factory=datetime.now)
    active : bool = True

    model_config = ConfigDict(from_attributes=True)


    # validations 

    @field_validator('user_name')
    def user_name_validation(cls, user_name: str) -> str:

        user_name = user_name.strip()

        if (len(user_name) == 0) :
            raise ValueError("User name should not be empty")
        
        if (len(user_name) > 50) :
            raise ValueError("User name cannot be more than 50 characters")
        
        if not user_name.isalpha():
            raise ValueError("User name should only contain alphabets")
        
        return user_name
    
    @field_validator('password')
    def password_validation(cls, password: str) -> str:

        password = password.strip()

        # check for up letter, d letter, special symbol, a number

        if len(password) <= 8:
            raise ValueError("Password length must be greater than 8")
        
        # if len(password) > 20:
        #     raise ValueError("Password length must be less than 21")

        has_letter = has_upper = has_lower = has_symbol = has_number = False
        
        for char in password:

            if char.isalpha():
                has_letter = True
            
            if char >= 'a' and char <= 'z':
                has_lower = True
            
            if char >= 'A' and char <= 'Z':
                has_upper = True

            if char >= '0' and char <= '9':
                has_number = True

            if char in "*/\\&^$#@!":
                has_symbol = True

        if not has_letter:
            raise ValueError("Password should have a letter")
        
        if not has_upper:
            raise ValueError("Password should have an upper case letter")
        
        if not has_lower:
            raise ValueError("Password should have a lower case letter")
        
        if not has_number:
            raise ValueError("Password should have a number")
        
        if not has_symbol:
            raise ValueError("Password should have a symbol")
        
        return password
    

    @field_validator('phone')
    def phone_validation(cls, phone: str) -> str:

        phone = phone.strip()
    
        if not phone.isnumeric():
            raise ValueError("Phone should only have numbers")

        if len(phone) < 10 or len(phone) >15:
            raise ValueError("Phone should only have length between 10 to 15")
        
        return phone
 


class User(UserCreate):

    user_id : int = Field(..., ge=0)
    profile_picture : Optional[str]
    id_picture : Optional[str]  # these both act as file url's in our server



class UserLoginRequest(BaseModel):

    user_email : EmailStr
    password : str

    @field_validator('password')
    def password_validation(cls, password: str) -> str:

        password = password.strip()

        # check for up letter, d letter, special symbol, a number

        if len(password) <= 8:
            raise ValueError("Password length must be greater than 8")
        
        if len(password) > 20:
            raise ValueError("Password length must be less than 21")

        has_letter = has_upper = has_lower = has_symbol = has_number = False
        
        for char in password:

            if char.isalpha():
                has_letter = True
            
            if char >= 'a' and char <= 'z':
                has_lower = True
            
            if char >= 'A' and char <= 'Z':
                has_upper = True

            if char >= '0' and char <= '9':
                has_number = True

            if char in "*/\\&^$#@!":
                has_symbol = True

        if not has_letter:
            raise ValueError("Password should have a letter")
        
        if not has_upper:
            raise ValueError("Password should have an upper case letter")
        
        if not has_lower:
            raise ValueError("Password should have a lower case letter")
        
        if not has_number:
            raise ValueError("Password should have a number")
        
        if not has_symbol:
            raise ValueError("Password should have a symbol")
        
        return password