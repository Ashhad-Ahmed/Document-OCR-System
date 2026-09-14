from fastapi import FastAPI
from app.api.routes.health import router as health_router

app = FastAPI(
    title="Document OCR System",
    description="OCR and document intelligence API",
    version="1.0.0",
)

app.include_router(health_router)


@app.get("/")
def root():
    return {"message": "Document OCR System API is running"}