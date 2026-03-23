import io
from typing import Optional, Tuple

import cv2
import numpy as np
from PIL import Image
import torch
from facenet_pytorch import MTCNN


# ---------------------------------
# Device
# ---------------------------------

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Better face detector than Haar
_mtcnn = MTCNN(keep_all=True, device=DEVICE)


# ---------------------------------
# Image Reading
# ---------------------------------

def read_image_bytes(image_bytes: bytes) -> np.ndarray:
    """
    Convert raw image bytes to OpenCV BGR image.
    """
    try:
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid image file: {e}")

    img_rgb = np.array(pil_img)
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)

    return img_bgr


# ---------------------------------
# Face Detection (MTCNN)
# ---------------------------------

def detect_faces(img_bgr: np.ndarray):
    """
    Detect all faces using MTCNN.
    Returns list of bounding boxes (x1, y1, x2, y2)
    """
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)

    boxes, _ = _mtcnn.detect(pil_img)

    if boxes is None:
        return []

    h, w = img_bgr.shape[:2]
    results = []

    for box in boxes:
        x1, y1, x2, y2 = box.tolist()

        x1 = max(0, int(x1))
        y1 = max(0, int(y1))
        x2 = min(w, int(x2))
        y2 = min(h, int(y2))

        if x2 > x1 and y2 > y1:
            results.append((x1, y1, x2, y2))

    return results


# ---------------------------------
# Largest Face Selection
# ---------------------------------

def detect_largest_face_bbox(img_bgr: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    """
    Return only the largest face bounding box.
    """
    boxes = detect_faces(img_bgr)

    if not boxes:
        return None

    best_box = None
    best_area = 0

    for (x1, y1, x2, y2) in boxes:
        area = (x2 - x1) * (y2 - y1)
        if area > best_area:
            best_area = area
            best_box = (x1, y1, x2, y2)

    return best_box


# ---------------------------------
# Crop Face
# ---------------------------------

def crop_face(
    img_bgr: np.ndarray,
    bbox: Tuple[int, int, int, int],
    margin: float = 0.20
) -> np.ndarray:
    """
    Crop face with optional margin.
    """
    h, w = img_bgr.shape[:2]
    x1, y1, x2, y2 = bbox

    bw = x2 - x1
    bh = y2 - y1

    mx = int(bw * margin)
    my = int(bh * margin)

    cx1 = max(0, x1 - mx)
    cy1 = max(0, y1 - my)
    cx2 = min(w, x2 + mx)
    cy2 = min(h, y2 + my)

    return img_bgr[cy1:cy2, cx1:cx2]