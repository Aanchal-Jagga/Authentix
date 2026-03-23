import easyocr
import numpy as np
import cv2


class OCRService:
    """
    Extracts text from images using EasyOCR.
    Supports English + Hindi.
    """

    def __init__(self):
        # GPU=False because you are on CPU (works fine)
        self.reader = easyocr.Reader(["en", "hi"], gpu=False)

    def extract_text(self, img_bgr) -> str:
        """
        img_bgr: OpenCV BGR image (numpy array)
        returns: cleaned extracted text
        """

        if img_bgr is None:
            return ""

        # Convert BGR -> RGB (EasyOCR expects RGB)
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

        results = self.reader.readtext(img_rgb, detail=0)

        if not results:
            return ""

        text = " ".join(results).strip()

        # Basic cleanup
        text = " ".join(text.split())

        return text
