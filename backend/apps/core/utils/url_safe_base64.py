import base64


def base64_encode(value: str) -> str:
    encoded = base64.urlsafe_b64encode(str.encode(value))
    result = encoded.rstrip(b"=")
    return result.decode()


def base64_decode(value: str) -> str:
    padding = 4 - (len(value) % 4)
    value = value + ("=" * padding)
    result = base64.urlsafe_b64decode(value)
    return result.decode()
