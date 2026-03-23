from google import genai
import json
import re
import os
from dotenv import load_dotenv

# 🔥 load .env
load_dotenv()


class QueryGenerator:

    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

    def generate(self, claim):

        prompt = f"""
You are a strict JSON generator.

Generate 3 short Google search queries to verify this claim.

Claim:
{claim}

Rules:
- Keep queries concise
- Focus on factual verification
- Include keywords like who, what, when if relevant
- Avoid long sentences

IMPORTANT:
- Return ONLY JSON list
- No markdown
- No explanation

Format:
["query1", "query2", "query3"]
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            # 🔥 SAFE TEXT EXTRACTION (important for 2.5)
            text = getattr(response, "text", None)

            if not text:
                raise ValueError("Empty response from Gemini")

            print("QUERY RAW:", text)

            # 🔥 CLEAN RESPONSE
            text = re.sub(r"```json|```", "", text)

            # 🔥 EXTRACT LIST
            match = re.search(r"\[[\s\S]*\]", text)

            if match:
                text = match.group()
            else:
                raise ValueError("No JSON list found")

            queries = json.loads(text)

            return queries[:3]

        except Exception as e:
            print("QueryGen Error:", e)
            print("Raw response:", getattr(response, "text", "No response"))

            # 🔥 FALLBACK (VERY IMPORTANT)
            return [
                claim,
                f"{claim} fact check",
                f"is it true {claim}"
            ]