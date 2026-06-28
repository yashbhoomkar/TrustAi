import logging

from fastapi import (
    APIRouter
)

from schemas.auth_schema import (
    SignupRequest,
    LoginRequest
)

from services.user_service import (
    signup,
    login
)

####

from fastapi import (
    APIRouter,
    Depends
)

from core.dependencies import (
    get_current_user
)

from services.user_service import (
    signup,
    login,
    get_current_user_profile
)

from schemas.user_schema import (
    UserResponse
)

logger = logging.getLogger(
    __name__
)

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


###########################################################
# Signup
###########################################################

@auth_router.post(
    "/signup"
)
async def signup_endpoint(
    request: SignupRequest
):

    logger.info(
        f"Signup Request: {request.email}"
    )

    return signup(
        email=request.email,
        password=request.password
    )


###########################################################
# Login
###########################################################

@auth_router.post(
    "/login"
)
async def login_endpoint(
    request: LoginRequest
):

    logger.info(
        f"Login Request: {request.email}"
    )

    return login(
        email=request.email,
        password=request.password
    )


###########################################################
# Current User
###########################################################

@auth_router.get(
    "/me",
    response_model=UserResponse
)
async def me_endpoint(

    current_user = Depends(
        get_current_user
    )

):

    logger.info(
        f"/auth/me requested by {current_user.email}"
    )

    return get_current_user_profile(
        current_user
    )