
# import torch
# import torch.nn.functional as F
# import numpy as np
# import requests
# import base64
# import os
# import cv2
# from PIL import Image
# from torchvision import transforms
# from dotenv import load_dotenv
# from google import genai

# from app.services.model_loader import swap_model, gan_model, DEVICE
# from app.utils.image_utils import detect_faces, crop_face

# load_dotenv()

# NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

# NVIDIA_AI_URL = "https://ai.api.nvidia.com/v1/cv/hive/ai-generated-image-detection"
# NVIDIA_DEEPFAKE_URL = "https://ai.api.nvidia.com/v1/cv/hive/deepfake-image-detection"

# gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# # ─────────────────────────────────────────────────────────────
# # Image preprocessing
# # ─────────────────────────────────────────────────────────────

# def preprocess_image(image_bgr):

#     image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
#     pil_img = Image.fromarray(image_rgb)

#     transform = transforms.Compose([
#         transforms.Resize((224, 224)),
#         transforms.ToTensor(),
#         transforms.Normalize(
#             mean=[0.485,0.456,0.406],
#             std=[0.229,0.224,0.225]
#         )
#     ])

#     return transform(pil_img).unsqueeze(0).to(DEVICE)


# # ─────────────────────────────────────────────────────────────
# # NVIDIA helpers
# # ─────────────────────────────────────────────────────────────

# def _img_to_b64(image_bgr):

#     _, buf = cv2.imencode('.jpg', image_bgr, [cv2.IMWRITE_JPEG_QUALITY,95])
#     return base64.b64encode(buf).decode('utf-8')


# def nvidia_ai_detection(image_bgr):

#     try:

#         headers = {
#             "Authorization": f"Bearer {NVIDIA_API_KEY}",
#             "Accept":"application/json",
#             "Content-Type":"application/json"
#         }

#         payload = {
#             "input":[f"data:image/jpeg;base64,{_img_to_b64(image_bgr)}"]
#         }

#         resp = requests.post(
#             NVIDIA_AI_URL,
#             headers=headers,
#             json=payload,
#             timeout=15
#         )

#         if resp.status_code != 200:
#             print("NVIDIA AI error:", resp.text)
#             return None,None,None

#         data = resp.json()["data"][0]

#         ai_prob = float(data.get("is_ai_generated",0.0))

#         is_ai = ai_prob > 0.35

#         sources = data.get("possible_sources",{})

#         top_source = max(
#             ((k,v) for k,v in sources.items() if k!="none"),
#             key=lambda x:x[1],
#             default=(None,0)
#         )

#         source = top_source[0] if top_source[1] > 0.01 else None
#         # If a generator is detected, treat as AI
#         if source is not None and source.lower() != "none":
#             ai_prob = max(ai_prob, 0.85)
#         is_ai = ai_prob > 0.35
#         print("DEBUG NVIDIA AI:", ai_prob, source)

#         return ai_prob, source

#     except Exception as e:

#         print("NVIDIA AI exception:", e)
#         return None,None


# def nvidia_deepfake_detection(image_bgr):

#     try:

#         headers = {
#             "Authorization": f"Bearer {NVIDIA_API_KEY}",
#             "Accept":"application/json",
#             "Content-Type":"application/json"
#         }

#         payload = {
#             "input":[f"data:image/jpeg;base64,{_img_to_b64(image_bgr)}"]
#         }

#         resp = requests.post(
#             NVIDIA_DEEPFAKE_URL,
#             headers=headers,
#             json=payload,
#             timeout=15
#         )

#         if resp.status_code != 200:
#             print("NVIDIA Deepfake error:", resp.text)
#             return None,None

#         data = resp.json()["data"][0]

#         is_fake = data.get("is_deepfake",False)
#         conf = float(data.get("confidence",0.5))

#         print("DEBUG NVIDIA Deepfake:", is_fake, conf)

#         return is_fake, conf

#     except Exception as e:

#         print("NVIDIA deepfake exception:", e)
#         return None,None


# # ─────────────────────────────────────────────────────────────
# # Gemini report
# # ─────────────────────────────────────────────────────────────

# def gemini_report(image_bgr, final_label, scores):

#     try:

#         img_pil = Image.fromarray(
#             cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
#         )

#         prompt = f"""
# You are an expert forensic image analyst.

# Detection results:

# Swap model score: {scores['swap_max']}
# GAN model score: {scores['gan_max']}
# NVIDIA AI confidence: {scores['nvidia_ai_conf']}
# NVIDIA Deepfake confidence: {scores['nvidia_df_conf']}

# Final verdict: {final_label}

# Explain:

# 1 What is visible in the image
# 2 Evidence supporting the verdict
# 3 Any visual artifacts
# 4 Your expert opinion
# 5 Final conclusion
# """

#         response = gemini_client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=[img_pil,prompt]
#         )

#         return response.text.strip()

#     except Exception as e:

#         print("Gemini error:",e)
#         return "Gemini analysis unavailable"
# def predict_swap(face_crop):

#     faces = [
#         face_crop,
#         cv2.rotate(face_crop, cv2.ROTATE_90_CLOCKWISE),
#         cv2.rotate(face_crop, cv2.ROTATE_90_COUNTERCLOCKWISE)
#     ]

#     preds = []

#     for f in faces:
#         t = preprocess_image(f)

#         with torch.no_grad():
#             out = swap_model(t)

#         p = F.softmax(out, dim=1)[0][0].item()
#         preds.append(p)

#     return np.median(preds)
# def analyze_image(image_bgr: np.ndarray):

#     faces = detect_faces(image_bgr)
#     print("DEBUG faces detected:", len(faces))
#     swap_max = 0.0
#     gan_max = 0.0
#     face_results = []

#     # ─────────────────────────────────────────────
#     # Step 1 — Face analysis
#     # ─────────────────────────────────────────────

#     if faces:

#         for bbox in faces:
#             small_face = False
            
#             swap_fake = 0.0
#             gan_fake = 0.0
#             x1, y1, x2, y2 = bbox
#             w = x2 - x1
#             h = y2 - y1
#             # detect tilted faces
#             tilted_face = False
#             ratio = w / h if h > 0 else 1
#             face_area = w * h
#             img_area = image_bgr.shape[0] * image_bgr.shape[1]
#             face_ratio = face_area / img_area
#             if ratio > 1.4 or ratio < 0.65 or face_ratio<0.02:
#                 tilted_face = True
#                 print("DEBUG: tilted face detected")
#             # Skip very small faces (reduces false positives)
#             if min(w, h) < 90:
#                 small_face = True
#                 print("DEBUG: small face detected")
                

#             pad = 0.25

#             x1, y1, x2, y2 = bbox
#             w = x2 - x1
#             h = y2 - y1

#             px = int(w * pad)
#             py = int(h * pad)

#             x1 = max(0, x1 - px)
#             y1 = max(0, y1 - py)
#             x2 = min(image_bgr.shape[1], x2 + px)
#             y2 = min(image_bgr.shape[0], y2 + py)

#             face_crop = image_bgr[y1:y2, x1:x2]
#             input_tensor = preprocess_image(face_crop)

#             with torch.no_grad():

#                 # swap_out = swap_model(input_tensor)
#                 gan_out = gan_model(input_tensor)

#                 swap_fake = predict_swap(face_crop)
#                 gan_fake = F.softmax(gan_out, dim=1)[0][0].item()
#             # suppress extreme swap predictions for difficult faces
#             # if swap_fake > 0.98 and gan_fake < 0.02 and (small_face or tilted_face):
#             #     print("DEBUG: swap overconfidence suppressed (pose)")
#             #     swap_fake *= 0.5
#             if tilted_face:
#                 print("DEBUG: pose suppression")
#                 swap_fake *= 0.5
#             swap_fake = min(swap_fake, 0.98)
#             if not small_face:
#                 swap_max = max(swap_max, swap_fake)
#             gan_max = max(gan_max, gan_fake)

#             face_label = "REAL"
#             face_conf = max(1 - swap_fake, 1 - gan_fake)
#             # swap_hits = 0
#             if swap_fake > 0.90 and not small_face:

#                 face_label = "FAKE_SWAP"
#                 face_conf = swap_fake
#             # small faces need stronger evidence
#             elif small_face and swap_fake > 0.97:
#                 face_label = "FAKE_SWAP"
#                 face_conf = swap_fake
#             elif gan_fake > 0.75:

#                 face_label = "FAKE_FACE"
#                 face_conf = gan_fake

#             x1, y1, x2, y2 = bbox

#             face_results.append({
#                 "bbox": [int(x1), int(y1), int(x2-x1), int(y2-y1)],
#                 "label": face_label,
#                 "confidence": round(face_conf,4),
#                 "swap_prob": round(swap_fake,4),
#                 "gan_prob": round(gan_fake,4)
#             })

#         # ─────────────────────────────────────────────
#         # Step 2 — If face models detect manipulation
#         # ─────────────────────────────────────────────

#         if swap_max > 0.93:

#             print("DEBUG FINAL: DEEPFAKE (swap)")

#             return {
#                 "label": "DEEPFAKE",
#                 "confidence": round(swap_max,4),
#                 "faces_detected": len(face_results),
#                 "source": "swap_model",
#                 "details": face_results
#             }

#         elif gan_max > 0.85:

#             print("DEBUG FINAL: AI_GENERATED (gan face)")

#             return {
#                 "label": "AI_GENERATED",
#                 "confidence": round(gan_max,4),
#                 "faces_detected": len(face_results),
#                 "source": "gan_model",
#                 "details": face_results
#             }

#     else:

#         print("DEBUG: No faces detected")

#     # ─────────────────────────────────────────────
#     # Step 3 — NVIDIA deepfake detection
#     # ─────────────────────────────────────────────

#     nvidia_df_flag, nvidia_df_conf = nvidia_deepfake_detection(image_bgr)

#     if nvidia_df_flag and nvidia_df_conf and nvidia_df_conf > 0.60:

#         print("DEBUG FINAL: DEEPFAKE (nvidia)")

#         return {
#             "label": "DEEPFAKE",
#             "confidence": round(nvidia_df_conf,4),
#             "faces_detected": len(face_results),
#             "source": "nvidia_deepfake",
#             "details": face_results
#         }

#     # ─────────────────────────────────────────────
#     # Step 4 — NVIDIA AI detection
#     # ─────────────────────────────────────────────

#     nvidia_ai_conf, nvidia_source = nvidia_ai_detection(image_bgr)
#     print(
#         "DEBUG SCORES →",
#         "swap:", swap_max,
#         "gan:", gan_max,
#         "nvidia_ai:", nvidia_ai_conf,
#         "source:", nvidia_source,
#         "nvidia_df:", nvidia_df_conf
#     )
#     if (nvidia_ai_conf is not None and nvidia_ai_conf > 0.20) or nvidia_source:

#         print("DEBUG FINAL: AI_GENERATED")

   
#         return {
#             "label": "AI_GENERATED",
#             "confidence": round(nvidia_ai_conf,4) if nvidia_ai_conf else 0.85,
#             "faces_detected": len(face_results),
#             "source": "nvidia_ai",
#             "generator": nvidia_source,
#             "details": face_results
#         }

#     # ─────────────────────────────────────────────
#     # Step 5 — Real image
#     # ─────────────────────────────────────────────

#     print("DEBUG FINAL: REAL")

#     return {
#         "label": "REAL",
#         "confidence": 0.90,
#         "faces_detected": len(face_results),
#         "source": "all_detectors_clear",
#         "details": face_results
#     }




import torch
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
from torchvision import transforms

from app.services.model_loader import swap_model, gan_model, DEVICE
from app.utils.image_utils import detect_faces

# ================================
# PREPROCESS
# ================================

def preprocess_image(image_bgr):
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(image_rgb)

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485,0.456,0.406],
            std=[0.229,0.224,0.225]
        )
    ])

    return transform(pil_img).unsqueeze(0).to(DEVICE)

# ================================
# GenD
# ================================

from huggingface_hub import hf_hub_download
from transformers import CLIPProcessor

gend_model_path = hf_hub_download(
    repo_id="yermandy/deepfake-detection",
    filename="model.torchscript",
    local_dir="weights"
)

gend_model = torch.jit.load(gend_model_path, map_location=DEVICE).eval()
gend_processor = CLIPProcessor.from_pretrained("openai/clip-vit-large-patch14")

def gend_detection(image_bgr):
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(image_rgb)

    inputs = gend_processor(images=pil_img, return_tensors="pt")
    pixel_values = inputs["pixel_values"].to(DEVICE)

    with torch.no_grad():
        output = gend_model(pixel_values)
        probs = output.softmax(dim=1).squeeze()

    return float(probs[1].item())  # fake prob

# ================================
# SigLIP (SUPPORT ONLY)
# ================================

from transformers import AutoModelForImageClassification, AutoImageProcessor

siglip_model = AutoModelForImageClassification.from_pretrained(
    "prithivMLmods/Deepfake-Detect-Siglip2"
).to(DEVICE).eval()

siglip_processor = AutoImageProcessor.from_pretrained(
    "prithivMLmods/Deepfake-Detect-Siglip2"
)

def siglip_detection(image_bgr):
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(image_rgb)

    inputs = siglip_processor(images=pil_img, return_tensors="pt")
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = siglip_model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)[0]

    return float(min(probs[0].item(), 0.95))  # class 0 = FAKE

# ================================
# SWAP
# ================================

def predict_swap(face_crop):
    faces = [
        face_crop,
        cv2.rotate(face_crop, cv2.ROTATE_90_CLOCKWISE),
        cv2.rotate(face_crop, cv2.ROTATE_90_COUNTERCLOCKWISE)
    ]

    preds = []
    for f in faces:
        t = preprocess_image(f)
        with torch.no_grad():
            out = swap_model(t)

        preds.append(F.softmax(out, dim=1)[0][0].item())

    return np.median(preds)

# ================================
# MAIN ANALYSIS
# ================================

def analyze_image(image_bgr: np.ndarray):

    faces = detect_faces(image_bgr)
    print("DEBUG faces:", len(faces))

    swap_max = 0.0
    gan_max = 0.0
    face_results = []

    # ============================
    # FACE ANALYSIS
    # ============================

    if faces:
        for (x1, y1, x2, y2) in faces:
            face_crop = image_bgr[y1:y2, x1:x2]

            input_tensor = preprocess_image(face_crop)

            with torch.no_grad():
                gan_out = gan_model(input_tensor)

            swap_fake = predict_swap(face_crop)
            gan_fake = F.softmax(gan_out, dim=1)[0][0].item()

            swap_max = max(swap_max, swap_fake)
            gan_max = max(gan_max, gan_fake)

            face_results.append({
                "bbox": [x1, y1, x2-x1, y2-y1],
                "swap_prob": round(swap_fake, 4),
                "gan_prob": round(gan_fake, 4)
            })

        # ============================
        # STRONG FACE DECISION
        # ============================

        if swap_max > 0.90:
            return {
                "label": "DEEPFAKE",
                "confidence": round(swap_max, 4),
                "faces_detected": len(face_results),
                "details": face_results
            }

        if gan_max > 0.85:
            return {
                "label": "AI_GENERATED",
                "confidence": round(gan_max, 4),
                "faces_detected": len(face_results),
                "details": face_results
            }

    # ============================
    # GLOBAL MODELS
    # ============================

    gend_fake = gend_detection(image_bgr)
    siglip_fake = siglip_detection(image_bgr)

    # 🔥 FIX: SigLIP is support only
    siglip_support = siglip_fake > 0.85
    global_fake = gend_fake

    print("DEBUG → swap:", swap_max,
          "gan:", gan_max,
          "gend:", gend_fake,
          "siglip:", siglip_fake)

    # ============================
    # GREY ZONE
    # ============================

    if faces and (swap_max > 0.30 or gan_max > 0.30):

        best = max(swap_max, gan_max, global_fake)

        if best > 0.50:
            label = "DEEPFAKE" if swap_max > gan_max else "AI_GENERATED"

            return {
                "label": label,
                "confidence": round(best, 4),
                "faces_detected": len(face_results),
                "details": face_results
            }

    # ============================
    # FACE CONFIDENT REAL
    # ============================

    if faces and swap_max < 0.30 and gan_max < 0.30:

        # Multi-face → always real
        if len(face_results) >= 2:
            return {
                "label": "REAL",
                "confidence": 0.95,
                "faces_detected": len(face_results),
                "details": face_results
            }

        # Single face → allow global override
        if gend_fake > 0.80 or (siglip_support and gend_fake > 0.50):
            return {
                "label": "AI_GENERATED",
                "confidence": round(max(gend_fake, siglip_fake), 4),
                "faces_detected": len(face_results),
                "details": face_results
            }

        return {
            "label": "REAL",
            "confidence": 0.90,
            "faces_detected": len(face_results),
            "details": face_results
        }

    # ============================
    # NO FACE → GLOBAL ONLY
    # ============================

    if gend_fake > 0.60 or (siglip_support and gend_fake > 0.40):
        return {
            "label": "AI_GENERATED",
            "confidence": round(max(gend_fake, siglip_fake), 4),
            "faces_detected": len(face_results),
            "details": face_results
        }

    # ============================
    # FINAL
    # ============================

    return {
        "label": "REAL",
        "confidence": 0.90,
        "faces_detected": len(face_results),
        "details": face_results
    }