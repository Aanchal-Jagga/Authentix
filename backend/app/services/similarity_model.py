from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

_model = None


def get_model():
    global _model
    if _model is None:
        print("Loading similarity model...")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def similarity_score(text1, text2):

    model = get_model()

    emb1 = model.encode([text1])
    emb2 = model.encode([text2])

    return float(cosine_similarity(emb1, emb2)[0][0])