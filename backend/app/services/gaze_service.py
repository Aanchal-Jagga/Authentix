import cv2

from app.utils.gaze.eye_tracker import EyeTracker
from app.utils.gaze.head_pose import HeadPoseEstimator
from app.utils.gaze.microsaccade_detector import MicroSaccadeDetector
from app.utils.gaze.scan_pattern_detector import ScanPatternDetector
from app.utils.gaze.gaze_estimator import GazeEstimator
from app.utils.gaze.artifact_detector import ArtifactDetector
from app.utils.gaze.fusion_engine import FusionEngine


class GazeService:

    def __init__(self):

        self.tracker = EyeTracker()
        self.head = HeadPoseEstimator()
        self.micro = MicroSaccadeDetector()
        self.scan = ScanPatternDetector()
        self.gaze = GazeEstimator()
        self.artifact = ArtifactDetector()
        self.fusion = FusionEngine()

    def analyze_frame(self, frame):

        eyes = self.tracker.detect(frame)

        head_pose = self.head.estimate(frame)
        gaze_data = self.gaze.estimate(eyes) if eyes else None
        micro_data = self.micro.update(eyes) if eyes else None
        scan_data = self.scan.update(eyes) if eyes else None
        artifact_data = self.artifact.detect(frame, eyes) if eyes else None

        result = self.fusion.evaluate(
            head_pose,
            gaze_data,
            micro_data,
            scan_data,
            artifact_data
        )

        return result