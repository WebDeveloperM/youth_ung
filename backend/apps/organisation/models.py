from core.models import BaseModel
from django.db import models
from ckeditor.fields import RichTextField
from users.utils.phone_validator import PHONE_VALIDATOR

from organisation.querysets.organisations import OrganisationQuerySet

from organisation.querysets.new import NewQuerySet


class Organisation(BaseModel):
    name = models.CharField(unique=True, max_length=200)
    email = models.EmailField(unique=True)
    address = models.CharField(unique=False, max_length=100)
    avatar = models.ImageField(upload_to='organisation/images', null=True, blank=True)
    phone = models.CharField(max_length=15, unique=True, validators=[PHONE_VALIDATOR], null=True)

    objects = OrganisationQuerySet.as_manager()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'organisation'


class Department(BaseModel):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(unique=True, max_length=300)

    def __str__(self):
        return f"{self.name} ({self.organisation})"

    class Meta:
        db_table = 'department'


class Section(BaseModel):
    departament = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='sections')
    name = models.CharField(unique=True, max_length=200)

    def __str__(self):
        return f"{self.departament.name} / {self.name}"

    class Meta:
        db_table = 'section'



class CategoryNew(BaseModel):
    title = models.CharField(max_length=500, verbose_name="Kategoriya nomi")

    def __str__(self):
        return f"{self.title    }"

    class Meta:
        verbose_name = 'CategoryNew'
        verbose_name_plural = 'Yangiliklar kategoyasi'



class New(BaseModel):
    category = models.ForeignKey(CategoryNew, on_delete=models.CASCADE, verbose_name="Kategoriyani tanlang",
                                 related_name="new")
    title = models.CharField(max_length=400, verbose_name="Sarlavha")
    mainImage = models.ImageField(default="new.png", verbose_name="Asosiy rasm. 500x500 shart", null=True, blank=True)
    description_1 = models.TextField(verbose_name="Ta'rif 1", null=True, blank=True)
    description_2 = RichTextField(verbose_name="Ta'rif 2", null=True, blank=True)
    img_1 = models.ImageField(verbose_name="Rasm 1", null=True, blank=True)
    description_3 = RichTextField(verbose_name="Ta'rif 3", null=True, blank=True)
    img_2 = models.ImageField(verbose_name="Rasm 2", null=True, blank=True)
    description_4 = RichTextField(verbose_name="Ta'rif 4", null=True, blank=True)
    img_3 = models.ImageField(verbose_name="Rasm 3", null=True, blank=True)
    description_5 = RichTextField(verbose_name="Ta'rif 5", null=True, blank=True)
    img_4 = models.ImageField(verbose_name="Rasm 4", null=True, blank=True)
    img_5 = models.ImageField(verbose_name="Rasm 5", null=True, blank=True)
    date = models.DateField()
    view = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True, verbose_name="Active:")

    objects = NewQuerySet.as_manager()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'New'
        verbose_name_plural = 'Yangiliklar'

