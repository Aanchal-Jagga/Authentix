import re


class TextRiskService:
    """
    Simple and effective rule-based classifier (fast, offline, no API).
    Works for English + Hindi scam/fake-news patterns.

    Output categories:
    - verified (low risk)
    - misleading
    - fake_news
    """

    def __init__(self):
        # Strong fake/scam indicators (English + Hindi)
        self.fake_keywords = [
            # English
            "share this", "forward this", "urgent", "breaking news",
            "guaranteed", "100% true", "secret", "miracle",
            "click here", "limited time", "free money", "win",
            "otp", "bank account", "credit card", "upi",
            "lottery", "giveaway", "claim now",

            # Hindi
            "फॉरवर्ड", "शेयर", "तुरंत", "ब्रेकिंग",
            "गारंटी", "100% सच", "चमत्कार", "मुफ्त",
            "जीतो", "इनाम", "लॉटरी", "अभी क्लिक करें",
            "ओटीपी", "बैंक", "यूपीआई", "खाता"
        ]

        self.misleading_keywords = [
            # English
            "shocking", "you won't believe", "exposed",
            "must watch", "viral", "truth", "hidden",
            "government", "policy", "ban", "warning",

            # Hindi
            "चौंकाने वाला", "सच्चाई", "वायरल",
            "सरकार", "नीति", "बैन", "चेतावनी"
        ]

    def score_text(self, text: str):
        """
        Returns:
        category: verified | misleading | fake_news
        confidence: 0..1
        """
        if not text or len(text.strip()) < 5:
            return {
                "category": "verified",
                "confidence": 0.05,
                "reason": "No meaningful text detected"
            }

        t = text.lower()

        fake_hits = 0
        misleading_hits = 0

        for kw in self.fake_keywords:
            if kw.lower() in t:
                fake_hits += 1

        for kw in self.misleading_keywords:
            if kw.lower() in t:
                misleading_hits += 1

        # Extra patterns: too many exclamation marks or all caps
        exclamations = t.count("!")
        caps_words = len(re.findall(r"\b[A-Z]{4,}\b", text))

        # Scoring logic
        fake_score = fake_hits * 0.18 + exclamations * 0.05 + caps_words * 0.08
        misleading_score = misleading_hits * 0.14 + exclamations * 0.03

        fake_score = min(fake_score, 1.0)
        misleading_score = min(misleading_score, 1.0)

        # Decision thresholds
        if fake_score >= 0.55:
            return {
                "category": "fake_news",
                "confidence": round(fake_score, 3),
                "reason": f"Fake/scam keywords detected: {fake_hits}"
            }

        if misleading_score >= 0.40:
            return {
                "category": "misleading",
                "confidence": round(misleading_score, 3),
                "reason": f"Misleading keywords detected: {misleading_hits}"
            }

        return {
            "category": "verified",
            "confidence": 0.15,
            "reason": "No strong fake-news patterns detected"
        }
