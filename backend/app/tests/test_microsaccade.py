import cv2
from app.utils.gaze.eye_tracker import EyeTracker
from app.utils.gaze.microsaccade_detector import MicroSaccadeDetector


def run_test():

    tracker = EyeTracker()
    detector = MicroSaccadeDetector()

    cap = cv2.VideoCapture(0)

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        eyes = tracker.detect(frame)

        if eyes:

            result = detector.update(eyes)

            if result:

                text = f"MicroMotion: {result['microsaccade_intensity']:.3f}"

                cv2.putText(
                    frame,
                    text,
                    (20,50),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    (0,255,0),
                    2
                )

        cv2.imshow("MicroSaccade Test", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_test()