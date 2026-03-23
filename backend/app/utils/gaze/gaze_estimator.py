import numpy as np


class GazeEstimator:

    def estimate(self, eye_data):

        if not eye_data:
            return None

        left_iris = eye_data["left_iris"]
        right_iris = eye_data["right_iris"]

        left_corner = eye_data["left_eye_corner"]
        right_corner = eye_data["right_eye_corner"]

        eye_center_x = (left_corner[0] + right_corner[0]) / 2
        eye_center_y = (left_corner[1] + right_corner[1]) / 2

        gaze_x = (left_iris[0] + right_iris[0]) / 2 - eye_center_x
        gaze_y = (left_iris[1] + right_iris[1]) / 2 - eye_center_y

        return {
            "gaze_x": float(gaze_x),
            "gaze_y": float(gaze_y)
        }