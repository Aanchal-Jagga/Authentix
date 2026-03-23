import shutil
import uuid
import os

from fastapi import APIRouter, UploadFile, File

from app.services.video_analyser import VideoAnalyzer
from app.services.gaze_service import GazeService
from app.services.realtime_gaze_analyzer import RealtimeGazeAnalyzer
from app.services.realtime_fusion_service import RealtimeFusionService

router = APIRouter()

video_analyzer = VideoAnalyzer()
gaze_service = GazeService()
realtime_analyzer = RealtimeGazeAnalyzer(gaze_service)
fusion_service = RealtimeFusionService()

@router.post("/detect-gaze-frame")
async def detect_gaze_frame(file: UploadFile = File(...)):

    try:
        contents = await file.read()

        import numpy as np
        import cv2

        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"error": "Invalid image"}

        result = fusion_service.analyze_frame(frame)

        print("Fusion result:", result)

        return {
            "ai_gaze_detected": bool(result.get("ai_gaze_detected", False)),
            "score": float(result.get("ai_gaze_score", 0))
            # "signals": {k: float(v) for k, v in result.get("signals", {}).items()}
        }
# 
    except Exception as e:

        import traceback
        traceback.print_exc()

        return {
            "error": "frame processing failed",
            "details": str(e)
        }

def stabilized_gaze_detection(analyzer, video_path):

    result1 = analyzer.analyze_video(video_path)
    result2 = analyzer.analyze_video(video_path)

    # If first two runs match, return immediately
    if result1["ai_gaze_detected"] == result2["ai_gaze_detected"]:
        return result1

    # Third run for tie-break
    result3 = analyzer.analyze_video(video_path)

    votes = [
        result1["ai_gaze_detected"],
        result2["ai_gaze_detected"],
        result3["ai_gaze_detected"]
    ]

    final_decision = votes.count(True) > votes.count(False)

    scores = [
        result1.get("final_score", 0),
        result2.get("final_score", 0),
        result3.get("final_score", 0)
    ]

    avg_score = sum(scores) / len(scores)

    ai_gaze_detected = avg_score > 0.32

    return {
        "ai_gaze_detected": ai_gaze_detected,
        "final_score": avg_score,
        "runs": [result1, result2, result3]
    }
    
@router.post("/detect-gaze-video-realtime")
async def detect_gaze_video_realtime(file: UploadFile = File(...)):

    temp_path = f"temp_{uuid.uuid4()}.mp4"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = stabilized_gaze_detection(realtime_analyzer, temp_path)

    finally:
        os.remove(temp_path)

    return result

@router.post("/detect-gaze-video")
async def detect_gaze_video(file: UploadFile = File(...)):

    temp_path = f"temp_{uuid.uuid4()}.mp4"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = video_analyzer.analyze_video(temp_path)

    finally:
        os.remove(temp_path)

    return result