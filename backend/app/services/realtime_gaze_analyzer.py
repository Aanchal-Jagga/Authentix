import cv2


class RealtimeGazeAnalyzer:

    def __init__(self, gaze_service):
        self.gaze_service = gaze_service

    def analyze_video(self, video_path):

        cap = cv2.VideoCapture(video_path)

        frame_index = 0
        analyzed_frames = 0
        suspicious = 0
        scores = []

        WINDOW = 60

        while True:

            ret, frame = cap.read()
            if not ret:
                break

            frame_index += 1

            # analyze every 2nd frame (noise reduction)
            if frame_index % 2 != 0:
                continue

            analyzed_frames += 1

            result = self.gaze_service.analyze_frame(frame)

            score = result.get("ai_gaze_score", 0)

            scores.append(score)

            # frame anomaly
            if score > 0.45:
                suspicious += 1

        cap.release()

        if analyzed_frames == 0:
            return {"error": "no frames analyzed"}

        # -------- Temporal smoothing --------
        avg_score = sum(scores) / len(scores)

        variance = sum((s - avg_score) ** 2 for s in scores) / len(scores)

        # final detection score
        final_score = avg_score + variance

        ai_gaze_detected = (
            (avg_score>0.30 and variance<0.025)
            or final_score> 0.36
        )

        return {
            "frames_analyzed": analyzed_frames,
            "avg_gaze_score": avg_score,
            "variance": variance,
            "final_score": final_score,
            "ai_gaze_detected": ai_gaze_detected
        }