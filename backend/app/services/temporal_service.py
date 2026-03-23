from datetime import datetime
import dateparser


class TemporalService:

    def analyze(self, articles):

        dates = []

        for a in articles:
            if a.get("date"):
                parsed = dateparser.parse(a["date"])
                if parsed:
                    dates.append(parsed)

        if not dates:
            return "UNKNOWN", None

        oldest = min(dates)
        now = datetime.now()

        diff_days = (now - oldest).days

        if diff_days > 365:
            return "OUTDATED", oldest.strftime("%Y-%m-%d")

        return "CURRENT", oldest.strftime("%Y-%m-%d")

# from datetime import datetime
# import dateparser


# class TemporalService:

#     def analyze(self, articles):

#         dates = []

#         for a in articles:
#             if a.get("date"):
#                 parsed = dateparser.parse(a["date"])
#                 if parsed:
#                     dates.append(parsed)

#         if not dates:
#             return {
#                 "status": "UNKNOWN",
#                 "first_seen": None,
#                 "latest_seen": None
#             }

#         now = datetime.now()

#         oldest = min(dates)   # ✅ first occurrence
#         latest = max(dates)   # ✅ most recent evidence

#         latest_diff = (now - latest).days

#         # 🔥 DECISION

#         if latest_diff > 365:
#             status = "OUTDATED"
#         else:
#             status = "CURRENT"

#         return {
#             "status": status,
#             "first_seen": oldest.strftime("%Y-%m-%d"),
#             "latest_seen": latest.strftime("%Y-%m-%d")
#         }