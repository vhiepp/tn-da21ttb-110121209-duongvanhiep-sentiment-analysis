from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginSocialRequest(BaseModel):
    provider: str
    provider_id: str

class ProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    username: str
    role: str