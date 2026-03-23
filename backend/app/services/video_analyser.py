import cv2
from app.services.gaze_service import GazeService


class VideoAnalyzer:

    def __init__(self):

        self.gaze_service = GazeService()

    def analyze_video(self, video_path):

        cap = cv2.VideoCapture(video_path)

        frames = 0
        fake_frames = 0
        scores = []

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            frames += 1

            # sample every 5 frames
            if frames % 5 != 0:
                continue

            result = self.gaze_service.analyze_frame(frame)

            score = result["ai_gaze_score"]

            scores.append(score)

            # lower threshold for frame suspicion
            if score > 0.45:
                fake_frames += 1

        cap.release()

        if frames == 0:
            return {"error": "video empty"}

        fake_ratio = fake_frames / max(len(scores),1)

        avg_score = sum(scores) / max(len(scores),1)

        return {
            "frames_processed": frames,
            "frames_analyzed": len(scores),
            "fake_frames": fake_frames,
            "fake_ratio": fake_ratio,
            "avg_score": avg_score,
            "ai_gaze_detected": avg_score > 0.45 or fake_ratio > 0.25
        }