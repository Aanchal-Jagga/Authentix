import hashlib
import os
import subprocess
import cv2
import numpy as np
from PIL import Image, ExifTags
import piexif


# ---------------------------
# FILE HASH
# ---------------------------

def calculate_hash(file_path):

    with open(file_path, "rb") as f:
        data = f.read()

    return hashlib.sha256(data).hexdigest()


# ---------------------------
# METADATA EXTRACTION
# ---------------------------

def extract_metadata(file_path):

    img = Image.open(file_path)

    metadata = {}

    try:

        exif = img._getexif()

        if exif:

            for tag, value in exif.items():

                name = ExifTags.TAGS.get(tag, tag)

                metadata[name] = str(value)

    except:

        pass

    return metadata


# ---------------------------
# EDIT SOFTWARE DETECTION
# ---------------------------

def detect_editing_software(metadata):

    editors = []

    for key, value in metadata.items():

        val = value.lower()

        if "photoshop" in val:
            editors.append("Adobe Photoshop")

        if "snapseed" in val:
            editors.append("Snapseed")

        if "instagram" in val:
            editors.append("Instagram")

        if "lightroom" in val:
            editors.append("Lightroom")

        if "snapchat" in val:
            editors.append("Snapchat")

    return editors


# ---------------------------
# JPEG STRUCTURE VALIDATION
# ---------------------------

def jpeg_structure_check(path):

    with open(path, "rb") as f:

        data = f.read()

    return data.startswith(b'\xff\xd8') and data.endswith(b'\xff\xd9')


# ---------------------------
# COMPRESSION HISTORY
# ---------------------------

def compression_analysis(path):

    img = Image.open(path)

    if img.format == "JPEG":

        return "JPEG compression detected"

    return "Unknown"


# ---------------------------
# ERROR LEVEL ANALYSIS
# ---------------------------

def perform_ela(path):

    original = Image.open(path).convert("RGB")

    temp = "temp.jpg"

    original.save(temp, "JPEG", quality=90)

    recompressed = Image.open(temp)

    ela = np.abs(np.array(original) - np.array(recompressed))

    ela = ela * 10

    ela = np.clip(ela, 0, 255).astype(np.uint8)

    ela_path = "ela_output.jpg"

    cv2.imwrite(ela_path, cv2.cvtColor(ela, cv2.COLOR_RGB2BGR))

    return ela_path


# ---------------------------
# CLONE DETECTION
# ---------------------------

def clone_detection(path):

    img = cv2.imread(path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    sift = cv2.SIFT_create()

    kp, desc = sift.detectAndCompute(gray, None)

    if desc is None:
        return 0

    bf = cv2.BFMatcher()

    matches = bf.knnMatch(desc, desc, k=2)

    good = []

    for m, n in matches:

        if m.distance < 0.75 * n.distance:

            good.append(m)

    return len(good)


# ---------------------------
# THUMBNAIL CHECK
# ---------------------------

def thumbnail_check(path):

    try:

        exif = piexif.load(path)

        thumb = exif.get("thumbnail")

        if thumb:

            return True

        return False

    except:

        return False


# ---------------------------
# C2PA SIGNATURE CHECK
# ---------------------------

def check_c2pa_signature(path):

    try:

        result = subprocess.run(
            ["c2patool", path],
            capture_output=True,
            text=True
        )

        if "claim" in result.stdout.lower():

            return "C2PA signature present"

        return "No signature found"

    except:

        return "C2PA tool not installed"