import cv2

from app.utils.gaze.eye_tracker import EyeTracker
from app.utils.gaze.head_pose import HeadPoseEstimator
from app.utils.gaze.microsaccade_detector import MicroSaccadeDetector
from app.utils.gaze.scan_pattern_detector import ScanPatternDetector
from app.utils.gaze.gaze_estimator import GazeEstimator
from app.utils.gaze.artifact_detector import ArtifactDetector
from app.utils.gaze.fusion_engine import FusionEngine


class RealtimeFusionService:

    def __init__(self):

        self.tracker = EyeTracker()
        self.head = HeadPoseEstimator()
        self.micro = MicroSaccadeDetector()
        self.scan = ScanPatternDetector()
        self.gaze = GazeEstimator()
        self.artifact = ArtifactDetector()
        self.fusion = FusionEngine()

    def analyze_frame(self, frame):

        try:

            # -------------------------------
            # detect eyes
            # -------------------------------

            eyes = self.tracker.detect(frame)

            if eyes is None:
                print("⚠️ No eyes detected")
            else:
                print("✅ Eyes detected")

            # -------------------------------
            # head pose always runs
            # -------------------------------

            head_pose = self.head.estimate(frame)

            print("Head pose:", head_pose)

            gaze_data = None
            micro_data = None
            scan_data = None
            artifact_data = None

            # -------------------------------
            # run eye-based detectors
            # -------------------------------

            if eyes is not None:

                try:
                    gaze_data = self.gaze.estimate(eyes)
                    print("Gaze:", gaze_data)
                except Exception as e:
                    print("Gaze estimation error:", e)

                try:
                    micro_data = self.micro.update(eyes)
                    print("Microsaccade:", micro_data)
                except Exception as e:
                    print("Microsaccade error:", e)

                try:
                    scan_data = self.scan.update(eyes)
                    print("Scan:", scan_data)
                except Exception as e:
                    print("Scan error:", e)

                try:
                    artifact_data = self.artifact.detect(frame, eyes)
                    print("Artifact:", artifact_data)
                except Exception as e:
                    print("Artifact error:", e)

            # -------------------------------
            # fusion
            # -------------------------------

            result = self.fusion.evaluate(
                head_pose,
                gaze_data,
                micro_data,
                scan_data,
                artifact_data
            )

            print("Fusion result:", result)

            return result

        except Exception as e:

            print("Fusion error:", e)

            return {
                "ai_gaze_detected": False,
                "ai_gaze_score": 0,
                "signals": {}
            }