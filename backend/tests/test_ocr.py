import os

os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["FLAGS_enable_pir_api"] = "0"

from paddleocr import PaddleOCR

ocr = PaddleOCR(
    lang="en",
    enable_mkldnn=False
)

result = ocr.predict("tests/images/sample.png")

for res in result:
    print("\nExtracted Text:")
    for text in res["rec_texts"]:
        print(text)