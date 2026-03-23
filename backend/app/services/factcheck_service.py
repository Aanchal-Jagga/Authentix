import requests
import tldextract

from app.services.similarity_model import similarity_score
from app.utils.source_reliability import get_source_score

API_KEY = "AIzaSyD46lR-DDplmvGFe0-z0vlUiybxuvU_6zw"


class FactCheckService:

    def check_claim(self, claim):

        url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

        params = {
            "query": claim,
            "key": API_KEY
        }

        response = requests.get(url, params=params)
        data = response.json()

        if "claims" not in data:
            return None

        best_match = None
        best_score = 0

        for claim_data in data["claims"]:

            claim_text = claim_data["text"]

            score = similarity_score(claim, claim_text)

            if score > best_score:
                best_score = score
                best_match = claim_data

        if best_match and best_score > 0.75:

            review = best_match["claimReview"][0]

            url = review["url"]
            domain = tldextract.extract(url).registered_domain

            return {
                "verdict": review["textualRating"],
                "title": review["title"],
                "publisher": review["publisher"]["name"],
                "url": url,
                "similarity": round(best_score, 3),
                "source_reliability": get_source_score(domain)
            }

        return None