import numpy as np


class FusionEngine:

    def __init__(self):

        # weights for each detection signal
        self.weights = {
            "head_gaze": 0.35,
            "microsaccade": 0.15,
            "scan_pattern": 0.10,
            "artifact": 0.10,
            "temporal_fixation": 0.30
        }

        # temporal smoothing
        self.score_history = []

        # gaze history for fixation analysis
        self.gaze_history = []
        self.max_history = 120  # ~4 seconds

    def evaluate(
        self,
        head_pose=None,
        gaze=None,
        micro=None,
        scan=None,
        artifact=None,
        correction=None
    ):

        score = 0
        signals = {}

        head_gaze_flag = False
        micro_flag = False
        fixation_flag = False

        # -------------------------------
        # HEAD vs GAZE mismatch
        # -------------------------------

        if head_pose and gaze:

            yaw = head_pose["yaw"]
            gaze_x = gaze["gaze_x"]

            mismatch = abs(yaw - gaze_x)

            signals["head_gaze_mismatch"] = float(mismatch)

            # reduced threshold (important)
            if mismatch > 10:
                head_gaze_flag = True

        # -------------------------------
        # MICROSACCADE anomaly
        # -------------------------------

        if micro:

            intensity = micro["microsaccade_intensity"]

            signals["microsaccade"] = float(intensity)

            if intensity < 0.2:
                micro_flag = True

        # -------------------------------
        # TEMPORAL FIXATION ANALYSIS
        # -------------------------------

        if gaze:

            self.gaze_history.append(gaze["gaze_x"])

            if len(self.gaze_history) > self.max_history:
                self.gaze_history.pop(0)

            if len(self.gaze_history) > 25:

                variation = np.std(self.gaze_history)

                signals["gaze_variation"] = float(variation)

                # extremely stable gaze → suspicious
                if variation < 1.0:
                    fixation_flag = True

        # -------------------------------
        # APPLY SIGNALS
        # -------------------------------

        if head_gaze_flag:
            score += self.weights["head_gaze"]

        if micro_flag:
            score += self.weights["microsaccade"]

        if fixation_flag:
            score += self.weights["temporal_fixation"]

        # -------------------------------
        # SCAN PATTERN
        # -------------------------------

        if scan:

            scan_score = scan["scan_pattern_score"]

            signals["scan_pattern"] = float(scan_score)

            if scan_score > 6:
                score += self.weights["scan_pattern"]

        # -------------------------------
        # ARTIFACT DETECTION
        # -------------------------------

        if artifact:

            art = artifact["artifact_score"]

            signals["artifact"] = float(art)

            if art > 4000:
                score += self.weights["artifact"]

        # -------------------------------
        # TEMPORAL SMOOTHING
        # -------------------------------

        self.score_history.append(score)

        if len(self.score_history) > 25:
            self.score_history.pop(0)

        avg_score = np.mean(self.score_history)

        return {
            "ai_gaze_score": float(avg_score),
            "ai_gaze_detected": avg_score > 0.35,
            "signals": signals
        }