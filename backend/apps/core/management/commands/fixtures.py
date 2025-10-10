from django.core.management import call_command
from django.core.management.base import BaseCommand

from academy.utils.download_and_resize_images import download_and_resize_images_category
from academy.utils.download_and_resize_images import download_and_resize_images_advertisement


class Command(BaseCommand):
    help = 'Loads all fixtures'

    def add_arguments(self, parser):
        parser.add_argument('-a', '--images', action='store_true', help='Downloads images from NET.')

    def handle(self, *args, **options):
        if options['images']:
            download_and_resize_images_category()
            download_and_resize_images_advertisement()

        call_command(
            'loaddata',

            # 'users_and_tokens',
            # 'chats',
            'category',
            'category_item',
            'advertisement',
            # 'student',
            # 'transaction',
            'transaction_category',
        )
