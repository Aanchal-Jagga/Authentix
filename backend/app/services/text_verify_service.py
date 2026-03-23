from app.services.factcheck_service import FactCheckService
from app.services.query_generator import QueryGenerator
from app.services.retrieval_service import RetrievalService
from app.services.temporal_service import TemporalService
from app.services.reasoning_service import ReasoningService

class TextVerifyService:

    def __init__(self):
        print("INIT START")

        self.fact = FactCheckService()
        print("FACT OK")

        self.query = QueryGenerator()
        print("QUERY OK")

        self.retrieve = RetrievalService()
        print("RETRIEVE OK")

        self.temporal = TemporalService()
        print("TEMPORAL OK")

        self.reason = ReasoningService()
        print("REASON OK")
        
    def analyze_claim(self, claim):

        try:
            print("STEP 1")
            fact_result = self.fact.check_claim(claim)

            print("STEP 2")
            queries = self.query.generate(claim)

            print("STEP 3")
            articles = self.retrieve.search(queries)

            print("STEP 4")
            temporal_status, detected_date = self.temporal.analyze(articles)
            # temporal_data = self.temporal.analyze(articles)
            print("STEP 5")
            reasoning = self.reason.analyze(claim, articles)

            return {
                "claim": claim,
                "verdict": reasoning.get("verdict", "UNKNOWN"),
                "confidence": reasoning.get("confidence", 0.5),
                "temporal_status": temporal_status,
                # "temporal": temporal_data,
                "sources": [a.get("url", "") for a in articles[:5]],
                "explanation": reasoning.get("explanation", "")
            }

        except Exception as e:
            print("🔥 CRASH:", str(e))

            return {
                "claim": claim,
                "verdict": "ERROR",
                "confidence": 0,
                "explanation": str(e)
            }
# class TextVerifyService:

#     def __init__(self):
#         self.fact = FactCheckService()
#         self.query = QueryGenerator()
#         self.retrieve = RetrievalService()
#         self.temporal = TemporalService()
#         self.reason = ReasoningService()

#     def analyze_claim(self, claim):

#         try:
#             print("STEP 1: FACT CHECK")
#             fact_result = self.fact.check_claim(claim)

#             print("STEP 2: QUERY GEN")
#             queries = self.query.generate(claim)

#             print("STEP 3: RETRIEVAL")
#             articles = self.retrieve.search(queries)

#             print("STEP 4: TEMPORAL")
#             temporal_status, detected_date = self.temporal.analyze(articles)

#             print("STEP 5: REASONING")
#             reasoning = self.reason.analyze(claim, articles)

#             return {
#                 "claim": claim,
#                 "verdict": reasoning["verdict"],
#                 "confidence": reasoning["confidence"],
#                 "temporal_status": temporal_status,
#                 "sources": [a["url"] for a in articles[:5]],
#                 "explanation": reasoning["explanation"]
#             }

#         except Exception as e:
#             print("🔥 ERROR:", str(e))

#             return {
#                 "claim": claim,
#                 "verdict": "ERROR",
#                 "confidence": 0,
#                 "explanation": str(e)
#             }