import numpy as np


class MicroSaccadeDetector:

    def __init__(self):

        self.prev_left = None
        self.prev_right = None

        self.movements = []

    def update(self, eye_data):

        if not eye_data:
            return None

        left = eye_data["left_iris"]
        right = eye_data["right_iris"]

        if self.prev_left is not None:

            dx = left[0] - self.prev_left[0]
            dy = left[1] - self.prev_left[1]

            movement = np.sqrt(dx*dx + dy*dy)

            self.movements.append(movement)

            if len(self.movements) > 30:
                self.movements.pop(0)

        self.prev_left = left
        self.prev_right = right

        if len(self.movements) == 0:
            return None

        avg_motion = np.mean(self.movements)

        return {
            "microsaccade_intensity": float(avg_motion)
        }