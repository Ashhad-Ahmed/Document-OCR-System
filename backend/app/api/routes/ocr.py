import os
import shutil
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, UploadFile, File

from app.services.ocr_service import process_document


router = APIRouter(prefix="/api/ocr", tags=["OCR"])


@router.post("/")
async def extract_text(file: UploadFile = File(...)):
    with NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        text = process_document(temp_path)

        return {
            "filename": file.filename,
            "text": text
        }

    finally:
        os.remove(temp_path)