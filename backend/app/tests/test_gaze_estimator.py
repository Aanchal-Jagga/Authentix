import cv2

from app.utils.gaze.eye_tracker import EyeTracker
from app.utils.gaze.gaze_estimator import GazeEstimator


def run_test():

    tracker = EyeTracker()
    estimator = GazeEstimator()

    cap = cv2.VideoCapture(0)

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        eyes = tracker.detect(frame)

        if eyes:

            result = estimator.estimate(eyes)

            if result:

                text = f"GazeX:{result['gaze_x']:.2f}"

                cv2.putText(
                    frame,
                    text,
                    (20,50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0,255,0),
                    2
                )

        cv2.imshow("Gaze Estimator Test", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_test()