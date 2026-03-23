# import torch
# import timm
# import torch.nn as nn
# import clip
# from safetensors.torch import load_file
# from pathlib import Path

# DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# BASE_DIR  = Path(__file__).resolve().parent.parent
# MODEL_DIR = BASE_DIR / "models"


# # ---------------- Existing 3 models ----------------
# def load_b0(weight_path, safetensor=False):
#     model = timm.create_model("efficientnet_b0", pretrained=False)
#     model.classifier = nn.Linear(model.classifier.in_features, 2)
#     if safetensor:
#         model.load_state_dict(load_file(weight_path))
#     else:
#         model.load_state_dict(torch.load(weight_path, map_location=DEVICE))
#     return model.to(DEVICE).eval()

# def load_b2(weight_path):
#     model = timm.create_model("efficientnet_b2", pretrained=False)
#     model.classifier = nn.Linear(model.classifier.in_features, 2)
#     model.load_state_dict(torch.load(weight_path, map_location=DEVICE))
#     return model.to(DEVICE).eval()

# def load_b3(weight_path):
#     model = timm.create_model("efficientnet_b3", pretrained=False)
#     model.classifier = nn.Linear(model.classifier.in_features, 2)
#     model.load_state_dict(torch.load(weight_path, map_location=DEVICE))
#     return model.to(DEVICE).eval()


# # ---------------- CLIP Classifier ----------------
# class CLIPClassifier(nn.Module):
#     def __init__(self, clip_model):
#         super().__init__()
#         self.clip = clip_model
#         for p in self.clip.parameters():
#             p.requires_grad = False
#         self.head = nn.Sequential(
#             nn.Linear(512, 256),
#             nn.BatchNorm1d(256),
#             nn.GELU(),
#             nn.Dropout(0.3),
#             nn.Linear(256, 64),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(64, 3)
#         )

#     def forward(self, x):
#         with torch.no_grad():
#             feat = self.clip.encode_image(x).float()
#         return self.head(feat)


# def load_clip():
#     clip_base, preprocess = clip.load("ViT-B/32", device=DEVICE)
#     model = CLIPClassifier(clip_base).to(DEVICE)
#     weight_path = MODEL_DIR / "clip_classifier_best_v2.pt"
#     print(f"Loading CLIP from: {weight_path}")
#     print(f"File size: {weight_path.stat().st_size / 1024 / 1024:.1f} MB")  # ← ADD
#     model.load_state_dict(torch.load(weight_path, map_location=DEVICE))
#     return model.eval(), preprocess

# # ---------------- Load All ----------------
# def load_all_models():
#     return {
#         "ff":       load_b0(MODEL_DIR / "best_deepfake_model.safetensors", safetensor=True),
#         "cifake":   load_b3(MODEL_DIR / "cifake_best_model.pth"),
#         "face140k": load_b2(MODEL_DIR / "140k_best_model.pth"),
#     }

import torch
import torch.nn as nn
from torchvision import models
import os

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

def load_swap_model():
    model = models.efficientnet_b3(weights=None)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, 2)

    model.load_state_dict(
        torch.load(os.path.join(MODEL_DIR, "authentix_face_swap_v1.pth"), map_location=DEVICE)
    )

    model.to(DEVICE)
    model.eval()
    return model


def load_gan_model():
    model = models.efficientnet_b3(weights=None)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, 2)

    model.load_state_dict(
        torch.load(os.path.join(MODEL_DIR, "gan_model.pth"), map_location=DEVICE)
    )

    model.to(DEVICE)
    model.eval()
    return model


swap_model = load_swap_model()
gan_model = load_gan_model()