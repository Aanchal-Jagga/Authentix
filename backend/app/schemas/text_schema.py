from pydantic import BaseModel

class ClaimRequest(BaseModel):
    text: str