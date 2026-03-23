import cv2
import mediapipe as mp
import numpy as np


class EyeTracker:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh

        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            refine_landmarks=True,
            max_num_faces=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def detect(self, frame):
        """
        Detect iris and eye positions.

        Args:
            frame (np.ndarray): BGR image

        Returns:
            dict or None
        """

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.face_mesh.process(rgb)

        if not results.multi_face_landmarks:
            return None

        face_landmarks = results.multi_face_landmarks[0]

        h, w, _ = frame.shape

        landmarks = []

        for lm in face_landmarks.landmark:
            x = int(lm.x * w)
            y = int(lm.y * h)
            landmarks.append((x, y))

        left_iris = landmarks[468]
        right_iris = landmarks[473]

        left_eye_corner = landmarks[33]
        right_eye_corner = landmarks[263]

        left_eye_box = self._compute_eye_box(landmarks, [33, 133, 159, 145])
        right_eye_box = self._compute_eye_box(landmarks, [362, 263, 386, 374])

        return {
            "left_iris": left_iris,
            "right_iris": right_iris,
            "left_eye_corner": left_eye_corner,
            "right_eye_corner": right_eye_corner,
            "left_eye_box": left_eye_box,
            "right_eye_box": right_eye_box
        }

    def _compute_eye_box(self, landmarks, idxs):

        xs = [landmarks[i][0] for i in idxs]
        ys = [landmarks[i][1] for i in idxs]

        x1 = min(xs)
        y1 = min(ys)
        x2 = max(xs)
        y2 = max(ys)

        return [x1, y1, x2, y2]