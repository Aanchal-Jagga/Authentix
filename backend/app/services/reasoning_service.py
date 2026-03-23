from google import genai
import json
import re
import os


class ReasoningService:

    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")  # ⚠️ use env variable
        )

    def analyze(self, claim, articles):

        # 🔥 STEP 1 — Build context from articles
        context = "\n\n".join([
            f"{a.get('title', '')} - {a.get('snippet', '')}"
            for a in articles[:5]
        ])

        # 🔥 STEP 2 — ULTRA STRICT PROMPT
        prompt = f"""
You are a strict JSON generator and professional fact-checker.

Claim:
{claim}

Evidence:
{context}

Task:
Classify the claim into ONE of:
TRUE / FALSE / MISLEADING / UNVERIFIABLE

Rules:
- Use the evidence provided
- Be factual and precise
- If clearly wrong → FALSE
- If partially true → MISLEADING
- If no evidence → UNVERIFIABLE

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include markdown
- Do NOT include any extra text

JSON FORMAT:
{{
  "verdict": "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIABLE",
  "confidence": number between 0 and 1,
  "explanation": "short explanation"
}}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            # 🔥 DEBUG (VERY IMPORTANT)
            print("RAW GEMINI RESPONSE:", response.text)

            text = response.text or ""

            # 🔥 STEP 3 — CLEAN RESPONSE
            text = re.sub(r"```json|```", "", text)

            # 🔥 STEP 4 — EXTRACT JSON
            match = re.search(r"\{[\s\S]*\}", text)

            if match:
                json_str = match.group()
                result = json.loads(json_str)
            else:
                raise ValueError("No JSON found in response")

            return result

        except Exception as e:
            print("❌ Reasoning Error:", e)
            print("❌ Raw response:", response.text if 'response' in locals() else "No response")

            return {
                "verdict": "UNVERIFIABLE",
                "confidence": 0.5,
                "explanation": "Parsing failed"
            }