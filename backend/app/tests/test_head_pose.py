import cv2
from app.utils.gaze.head_pose import HeadPoseEstimator


def run_test():

    estimator = HeadPoseEstimator()

    cap = cv2.VideoCapture(0)

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        pose = estimator.estimate(frame)

        if pose:

            text = f"Yaw:{pose['yaw']:.2f} Pitch:{pose['pitch']:.2f}"

            cv2.putText(
                frame,
                text,
                (20,50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0,255,0),
                2
            )

        cv2.imshow("Head Pose Test", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_test()