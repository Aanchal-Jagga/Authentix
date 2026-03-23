import cv2
import numpy as np


class ReflectionDetector:

    def detect(self, frame, eye_landmarks):

        if eye_landmarks is None:
            return None

        x1,y1,x2,y2 = eye_landmarks

        eye = frame[y1:y2, x1:x2]

        if eye.size == 0:
            return None

        gray = cv2.cvtColor(eye, cv2.COLOR_BGR2GRAY)

        # find bright reflection spots
        _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)

        points = np.column_stack(np.where(thresh > 0))

        if len(points) < 5:
            return {"reflection_score":0}

        centroid = np.mean(points, axis=0)

        center = np.array(gray.shape) / 2

        dist = np.linalg.norm(centroid - center)

        return {"reflection_score":float(dist)}