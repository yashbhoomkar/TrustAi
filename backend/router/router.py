from fastapi import APIRouter

from router.auth_router import (
    auth_router
)

from router.apikey_router import (
    apikey_router
)

from router.dataset_router import (
    dataset_router
)

from router.metric_router import (
    metric_router
)
from router.evaluation_router import evaluation_router

router = APIRouter()

router.include_router(
    auth_router,
    tags=["Authentication"]
)

router.include_router(
    apikey_router
)

router.include_router(
    dataset_router
)

router.include_router(
    metric_router
)

router.include_router(evaluation_router)

@router.get("/")
async def root():

    return {
        "application":
        "TrustAI",
        "status":
        "running"
    }