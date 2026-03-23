import requests

SERP_API_KEY = "906cd92ab1e627d56e0c508831d2e543e4fcd65489ad0316ce52c320286dad40"


class RetrievalService:

    def search(self, queries):

        results = []

        for q in queries:

            url = "https://serpapi.com/search.json"

            params = {
                "q": q,
                "api_key": SERP_API_KEY,
                "num": 5
            }

            response = requests.get(url, params=params)
            data = response.json()

            for item in data.get("organic_results", []):

                results.append({
                    "title": item.get("title", ""),
                    "snippet": item.get("snippet", ""),
                    "url": item.get("link", ""),
                    "date": item.get("date", "")
                })

        return results[:8]