import base64
from typing import Literal


def cryption_base64(encrypted_text: str, encode_or_decode: Literal['encode', 'decode'] = 'encode'):
    try:
        converted_2_bytes = encrypted_text.encode("utf-8")
        if encode_or_decode == 'encode':
            return base64.b64encode(converted_2_bytes).decode("utf-8")

        return base64.b64decode(converted_2_bytes).decode("utf-8")

    except Exception as err:
        print(err)
