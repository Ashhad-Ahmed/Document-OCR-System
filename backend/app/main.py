from fastapi import FastAPI

app = FastAPI(
    title="Document OCR System",
    description="OCR and document intelligence API",
    version="1.0.0",
)


@app.get("/")
def root():
    return {"message": "Document OCR System API is running"}