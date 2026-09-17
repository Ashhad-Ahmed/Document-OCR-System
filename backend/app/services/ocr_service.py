import os

os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["FLAGS_enable_pir_api"] = "0"

from paddleocr import PaddleOCR


ocr = PaddleOCR(
    lang="en",
    enable_mkldnn=False
)


def process_document(image_path: str):
    result = ocr.predict(image_path)

    extracted_text = []

    for res in result:
        extracted_text.extend(res["rec_texts"])

    return extracted_text