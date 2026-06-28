from fastapi import FastAPI
import logging

from logs.log import setup_logger

from router.router import router

from fastapi.middleware.cors import CORSMiddleware

from database.postgres.connection import (
    Base,
    engine
)

from database.postgres.models import User

setup_logger()

logger = logging.getLogger(
    __name__
)

app = FastAPI(
    title="TrustAI",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://82.112.237.61:5173",
        "http://trustai.duckdns.org:8080",
        "http://trustai.duckdns.org:8080/proxy/5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(
    bind=engine
)

app.include_router(
    router
)

logger.info(
    "TrustAI Started"
)