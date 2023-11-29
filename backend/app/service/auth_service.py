import base64
from datetime import datetime
from uuid import uuid4
from fastapi import HTTPException

from passlib.context import CryptContext

from app.schema import ForgotPasswordSchema, LoginSchema, RegisterSchema
from app.model import Person, Users, UsersRole
from app.repository.role import RoleRepository
from app.repository.users import UsersRepository
from app.repository.person import PersonRepository
from app.repository.user_role import UsersRoleRepository
from app.model.role import Role
from app.repository.auth_repo import JWTRepo

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



class AuthService:
    
    @staticmethod
    async def register_service(register: RegisterSchema):
        _person_id = str(uuid4())
        _users_id = str(uuid4())
        with open("./media/profile.png", "rb") as f:
            image_str = base64.b64encode(f.read())
        image_str = "data:image/png;base64," + image_str.decode('utf-8')
        
        birth_date = datetime.strptime(register.birth, '%m-%d-%Y')
        
        _person = Person(id=_person_id,
                         name=register.name,
                         birth=birth_date,
                         sex=register.sex,
                         profile="",
                         phone_number=register.phone_number)
        
        _users = Users(id=_users_id,
                       name=register.name,
                       username=register.username,
                       email=register.email,
                       password=pwd_context.hash(register.password),
                       person_id=_person_id,
                       )
        
        _role = await RoleRepository.find_by_role_name("user")
        _users_role = UsersRole(users_id=_users_id, role_id=_role.id)
        
        _username = await UsersRepository.find_by_username(register.username)
        if _username:
            raise HTTPException(status_code=400, detail="Username already exists")

        _email = await UsersRepository.find_by_email(register.email)
        if _email:
            raise HTTPException(status_code=400, detail="Email already signed up")
        
        else:
            await PersonRepository.create(**_person.dict())
            await UsersRepository.create(**_users.dict())
            await UsersRoleRepository.create(**_users_role.dict())
        
    @staticmethod
    async def logins_service(login: LoginSchema):
        _username = await UsersRepository.find_by_username(login.username)
        
        if _username is not None:
            if not pwd_context.verify(login.password, _username.password):
                raise HTTPException(status_code=400, detail="Invalid Password")
            return JWTRepo(data={"username":_username.username}).generate_token()
        raise HTTPException(status_code=404, detail="Username not found")

    @staticmethod
    async def forgot_password_service(forgot_password: ForgotPasswordSchema):
        _email = await UsersRepository.find_by_email(forgot_password.email)
        
        if _email is None:
            raise HTTPException(status_code=404, detail="Email not found")
        await UsersRepository.update_password(forgot_password.email, pwd_context.hash(forgot_password.new_password))
        
        
async def generate_role():
    _role = await RoleRepository.find_by_list_role_name(["admin", "user"])
    
    if not _role:
        await RoleRepository.create_list([Role(id=str(uuid4()), role_name="admin"), Role(id=str(uuid4()), role_name="user")])