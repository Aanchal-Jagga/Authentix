import numpy as np


class EyeCorrectionDetector:

    def __init__(self):
        self.history = []

    def update(self, gaze_vector):

        if gaze_vector is None:
            return {"correction_score": 0}

        self.history.append(gaze_vector)

        if len(self.history) > 20:
            self.history.pop(0)

        if len(self.history) < 5:
            return {"correction_score": 0}

        movements = []

        for i in range(1, len(self.history)):
            diff = np.linalg.norm(
                np.array(self.history[i]) - np.array(self.history[i - 1])
            )
            movements.append(diff)

        avg_movement = np.mean(movements)

        # AI gaze correction suppresses micro movements
        correction_score = max(0, 0.03 - avg_movement)

        return {
            "correction_score": float(correction_score)
        }