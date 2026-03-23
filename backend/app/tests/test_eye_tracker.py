import cv2
from app.utils.gaze.eye_tracker import EyeTracker


def run_test():

    tracker = EyeTracker()

    cap = cv2.VideoCapture(0)

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        result = tracker.detect(frame)

        if result:

            lx, ly = result["left_iris"]
            rx, ry = result["right_iris"]

            cv2.circle(frame, (lx, ly), 4, (0, 255, 0), -1)
            cv2.circle(frame, (rx, ry), 4, (0, 255, 0), -1)

            x1, y1, x2, y2 = result["left_eye_box"]
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255,0,0), 2)

            x1, y1, x2, y2 = result["right_eye_box"]
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255,0,0), 2)

        cv2.imshow("Eye Tracker Test", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_test()