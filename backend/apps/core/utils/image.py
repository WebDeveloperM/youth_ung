import os
from typing import Dict

import requests
from PIL import Image


class ResizeImage:
    def __init__(self, width: int = None, height: int = None):
        self.width = width
        self.height = height

    def resize(self, path: str, w=None, h=None):
        if not os.path.exists(path):
            return 'File does not exists!'

        width = w if w else self.width
        height = h if h else self.height

        img = Image.open(path)
        img_width, img_height = img.size

        if width != img_width and height != img_height:
            img = img.resize((width, height), Image.ADAPTIVE)
            img.save(path)


class DownloadImage:
    """
    Example:
        urls: {'name': 'link_to_img'}
        path: os.path.join(settings.BASE_DIR, 'images')
    """
    def __init__(self, urls: Dict[str, str], path: str):
        self.urls = urls
        self.path = path

    def download(self):
        try:
            if not os.path.exists(self.path):
                os.makedirs(self.path)

            if not isinstance(self.urls, dict):
                raise Exception('`urls` is not Dict[str, str] type!')

            for key in self.urls:
                file = requests.get(self.urls[key]).content
                file_path = os.path.join(self.path, key + '.png')
                with open(file_path, "wb") as f:
                    f.write(file)
                yield file_path

        except Exception as err:
            print(err)


class DownloadAndResizeImage(DownloadImage, ResizeImage):
    def __init__(self, urls: Dict[str, str], path: str):
        super().__init__(urls, path)

    def download_and_resize(self):
        file_path = self.download()
        for path in file_path:
            print(f'Saved image: {path.split("/")[-1]}')
            self.resize(path, 500, 500)
