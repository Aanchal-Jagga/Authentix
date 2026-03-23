import numpy as np


class ScanPatternDetector:

    def __init__(self):

        self.history = []

    def update(self, eye_data):

        if not eye_data:
            return None

        x = eye_data["left_iris"][0]

        self.history.append(x)

        if len(self.history) > 60:
            self.history.pop(0)

        if len(self.history) < 10:
            return None

        movement = np.std(self.history)

        return {
            "scan_pattern_score": float(movement)
        }