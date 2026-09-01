from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from pydantic import BaseModel, EmailStr, Field
from app.db.postgres import async_session
from app.db.models import Tenant
from app.core.security import hash_api_key, verify_api_key, create_access_token

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
async def signup(body: SignupRequest):
    async with async_session() as session:
        result = await session.execute(select(Tenant).where(Tenant.email == body.email))
        existing = result.scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists",
            )

        tenant = Tenant(
            name=body.name,
            email=body.email,
            password_hash=hash_api_key(body.password),
        )
        session.add(tenant)
        await session.commit()
        await session.refresh(tenant)

        token = create_access_token(str(tenant.id))
        return {"access_token": token, "tenant_id": str(tenant.id), "name": tenant.name}


@router.post("/login")
async def login(body: LoginRequest):
    async with async_session() as session:
        result = await session.execute(select(Tenant).where(Tenant.email == body.email))
        tenant = result.scalar_one_or_none()

        if not tenant or not tenant.password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not verify_api_key(body.password, tenant.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        token = create_access_token(str(tenant.id))
        return {"access_token": token, "tenant_id": str(tenant.id), "name": tenant.name}