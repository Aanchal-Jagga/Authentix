import cv2
import numpy as np


class ArtifactDetector:

    def detect(self, frame, eye_data):

        if not eye_data:
            return None

        x1, y1, x2, y2 = eye_data["left_eye_box"]

        eye_crop = frame[y1:y2, x1:x2]

        if eye_crop.size == 0:
            return None

        gray = cv2.cvtColor(eye_crop, cv2.COLOR_BGR2GRAY)

        variance = np.var(gray)

        return {
            "artifact_score": float(variance)
        }