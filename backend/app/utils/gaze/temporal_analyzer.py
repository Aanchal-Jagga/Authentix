import numpy as np

class TemporalAnalyzer:

    def __init__(self):

        self.gaze_history = []
        self.max_frames = 150   # ~5 seconds

    def update(self, gaze):

        if not gaze:
            return None

        self.gaze_history.append(gaze["gaze_x"])

        if len(self.gaze_history) > self.max_frames:
            self.gaze_history.pop(0)

        if len(self.gaze_history) < 30:
            return None

        movement = np.std(self.gaze_history)

        # very low movement = suspicious fixation
        fixation_anomaly = movement < 0.5

        return {
            "gaze_variation": float(movement),
            "fixation_anomaly": fixation_anomaly
        }