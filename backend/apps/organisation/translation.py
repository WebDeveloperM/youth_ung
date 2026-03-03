from modeltranslation.translator import register, TranslationOptions
from organisation.models import Organisation, Department, Section


@register(Organisation)
class OrganisationTranslationOptions(TranslationOptions):
    fields = ('name', 'address',)


@register(Department)
class DepartmentItemTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Section)
class SectionTranslationOptions(TranslationOptions):
    fields = ('name',)
