from app.utils.forensic_utils import *


class ForensicService:

    def analyze_image(self, path):

        metadata = extract_metadata(path)

        editing = detect_editing_software(metadata)

        jpeg_valid = jpeg_structure_check(path)

        compression = compression_analysis(path)

        clone_score = clone_detection(path)

        thumbnail = thumbnail_check(path)

        signature = check_c2pa_signature(path)

        ela = perform_ela(path)

        interpretation = []

        # ------------------------
        # METADATA INTERPRETATION
        # ------------------------

        device = metadata.get("Model")
        capture_time = metadata.get("DateTimeOriginal")

        if not device:
            device = "Metadata removed or unavailable"
            interpretation.append("Camera metadata missing")

        if not capture_time:
            capture_time = "Capture time unavailable"

        # ------------------------
        # EDIT SOFTWARE
        # ------------------------

        if editing:
            interpretation.append("Editing software detected")

        # ------------------------
        # JPEG STRUCTURE
        # ------------------------

        if not jpeg_valid:
            interpretation.append("File structure anomaly")

        # ------------------------
        # CLONE DETECTION
        # ------------------------

        if clone_score < 500:
            clone_risk = "Low"
        elif clone_score < 2000:
            clone_risk = "Moderate"
            interpretation.append("Moderate duplicated patterns detected")
        else:
            clone_risk = "High"
            interpretation.append("High duplicated pattern similarity")

        # ------------------------
        # THUMBNAIL CHECK
        # ------------------------

        if not thumbnail:
            interpretation.append("No embedded thumbnail found")

        # ------------------------
        # SIGNATURE CHECK
        # ------------------------

        if isinstance(signature, str) and "No signature" in signature:
            interpretation.append("No authenticity signature found")

        # ------------------------
        # FINAL VERDICT
        # ------------------------

        if len(interpretation) == 0:
            verdict = "No manipulation indicators detected"
        elif len(interpretation) <= 2:
            verdict = "Minor anomalies detected"
        else:
            verdict = "Multiple forensic anomalies detected"

        result = {

            "file_hash": calculate_hash(path),

            "device": device,

            "capture_time": capture_time,

            "editing_software": editing if editing else "None detected",

            "jpeg_structure": "Valid" if jpeg_valid else "Modified",

            "compression": compression,

            "clone_score": clone_score,

            "clone_risk": clone_risk,

            "thumbnail_present": thumbnail,

            "c2pa_signature": signature,

            "analysis_flags": interpretation,

            "verdict": verdict,

            "ela_result": ela
        }

        return result