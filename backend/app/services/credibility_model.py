from transformers import pipeline
import torch

classifier = pipeline(
    "text-classification",
    model="mrm8488/bert-tiny-finetuned-fake-news-detection",
    device=-1
)

def analyze_text(text):

    result = classifier(text)[0]

    label_map = {
    "LABEL_0": "REAL",
    "LABEL_1": "FAKE"
    }

    return {
        "label": label_map.get(result["label"], result["label"]),
        "score": float(result["score"])
    }