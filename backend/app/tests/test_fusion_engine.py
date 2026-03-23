import cv2

from app.utils.gaze.eye_tracker import EyeTracker
from app.utils.gaze.head_pose import HeadPoseEstimator
from app.utils.gaze.microsaccade_detector import MicroSaccadeDetector
from app.utils.gaze.scan_pattern_detector import ScanPatternDetector
from app.utils.gaze.gaze_estimator import GazeEstimator
from app.utils.gaze.artifact_detector import ArtifactDetector
from app.utils.gaze.fusion_engine import FusionEngine


def run_test():

    tracker = EyeTracker()
    head = HeadPoseEstimator()
    micro = MicroSaccadeDetector()
    scan = ScanPatternDetector()
    gaze = GazeEstimator()
    artifact = ArtifactDetector()
    fusion = FusionEngine()

    cap = cv2.VideoCapture(0)

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        eyes = tracker.detect(frame)

        head_pose = head.estimate(frame)
        gaze_data = gaze.estimate(eyes) if eyes else None
        micro_data = micro.update(eyes) if eyes else None
        scan_data = scan.update(eyes) if eyes else None
        artifact_data = artifact.detect(frame, eyes) if eyes else None

        result = fusion.evaluate(
            head_pose,
            gaze_data,
            micro_data,
            scan_data,
            artifact_data
        )

        text = f"AI Gaze Score: {result['ai_gaze_score']:.2f}"

        if result["ai_gaze_detected"]:
            color = (0,0,255)
            label = "FAKE GAZE DETECTED"
        else:
            color = (0,255,0)
            label = "NORMAL"

        cv2.putText(
            frame,
            text,
            (20,40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            color,
            2
        )

        cv2.putText(
            frame,
            label,
            (20,80),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            color,
            2
        )

        cv2.imshow("Fusion Engine Test", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run_test()