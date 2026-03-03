from django.apps import AppConfig

class OrganisationConfig(AppConfig):
    name = 'organisation'

    def ready(self):
        import organisation.translation
