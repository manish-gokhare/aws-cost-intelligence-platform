from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.costs import router as costs_router


app = FastAPI(
    title="AWS Cost Intelligence API",
    description="Backend API for AWS cloud cost intelligence.",
    version="0.1.0",
)


# Allow the local React/Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(costs_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "aws-cost-intelligence-api",
    }
