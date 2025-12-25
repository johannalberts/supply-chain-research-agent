# app/auth_api.py
import jwt
from datetime import datetime, timedelta
from typing import Optional
from ninja import Router, Schema
from ninja.errors import HttpError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.http import HttpRequest

router = Router()

# JWT Configuration
JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_SECONDS = 60 * 60 * 24 * 7  # 7 days

# --- INPUT SCHEMAS ---
class SignupRequest(Schema):
    username: str
    email: str
    password: str

class LoginRequest(Schema):
    username: str
    password: str

# --- OUTPUT SCHEMAS ---
class UserSchema(Schema):
    id: int
    username: str
    email: str

class AuthResponse(Schema):
    user: UserSchema
    token: str

class MessageResponse(Schema):
    message: str

# --- HELPER FUNCTIONS ---
def generate_token(user: User) -> str:
    """Generate JWT token for user"""
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_user_from_token(request: HttpRequest) -> Optional[User]:
    """Extract user from JWT token in Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    payload = verify_token(token)
    
    if not payload:
        return None
    
    try:
        user = User.objects.get(id=payload['user_id'])
        return user
    except User.DoesNotExist:
        return None

# --- ENDPOINTS ---
@router.post("/signup", response=AuthResponse)
def signup(request, data: SignupRequest):
    """
    Create a new user account.
    """
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Signup attempt - username: {data.username}, email: {data.email}")
    
    # Check if username already exists
    if User.objects.filter(username=data.username).exists():
        logger.warning(f"Username already exists: {data.username}")
        raise HttpError(400, "Username already exists")
    
    # Check if email already exists
    if User.objects.filter(email=data.email).exists():
        logger.warning(f"Email already exists: {data.email}")
        raise HttpError(400, "Email already exists")
    
    # Create user
    user = User.objects.create_user(
        username=data.username,
        email=data.email,
        password=data.password
    )
    
    # Generate token
    token = generate_token(user)
    
    return AuthResponse(
        user=UserSchema(
            id=user.id,
            username=user.username,
            email=user.email
        ),
        token=token
    )

@router.post("/login", response=AuthResponse)
def login(request, data: LoginRequest):
    """
    Login with username and password.
    """
    user = authenticate(username=data.username, password=data.password)
    
    if user is None:
        raise HttpError(401, "Invalid credentials")
    
    # Generate token
    token = generate_token(user)
    
    return AuthResponse(
        user=UserSchema(
            id=user.id,
            username=user.username,
            email=user.email
        ),
        token=token
    )

@router.get("/me", response=UserSchema)
def get_current_user(request):
    """
    Get current user from token.
    """
    user = get_user_from_token(request)
    
    if user is None:
        raise HttpError(401, "Invalid or expired token")
    
    return UserSchema(
        id=user.id,
        username=user.username,
        email=user.email
    )

@router.post("/logout", response=MessageResponse)
def logout(request):
    """
    Logout (client should delete token).
    """
    return MessageResponse(message="Successfully logged out")
