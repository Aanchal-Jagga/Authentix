SOURCE_TRUST = {

    "reuters.com": 0.95,
    "bbc.com": 0.93,
    "nytimes.com": 0.92,
    "theguardian.com": 0.90,

    "cnn.com": 0.85,
    "aljazeera.com": 0.82,

    "boomlive.in": 0.80,

    "randomblog.com": 0.30
}


def get_source_score(domain):

    if domain in SOURCE_TRUST:
        return SOURCE_TRUST[domain]

    return 0.5