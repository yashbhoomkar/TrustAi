from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

GEMINI_API_KEY = os.getenv(

    "GEMINI_API_KEY"

)

GEMINI_MODEL = "gemini-2.5-flash"