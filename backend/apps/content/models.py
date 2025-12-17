from django.db import models
from core.models import BaseModel
from ckeditor.fields import RichTextField


class News(BaseModel):
    """Новости компании"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Заголовок (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Заголовок (EN)")
    
    content_uz = RichTextField(verbose_name="Контент (UZ)")
    content_ru = RichTextField(verbose_name="Контент (RU)")
    content_en = RichTextField(verbose_name="Контент (EN)")
    
    image = models.ImageField(upload_to='news/', verbose_name="Изображение", blank=True, null=True)
    date = models.DateField(verbose_name="Дата")
    
    # Статистика
    likes = models.IntegerField(default=0, verbose_name="Лайки")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Статус публикации
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")
    is_featured = models.BooleanField(default=False, verbose_name="Избранное")
    
    class Meta:
        db_table = 'content_news'
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
        ordering = ['-date']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Grant(BaseModel):
    """Гранты для молодежи"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Название (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Название (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Название (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Полное описание (UZ)")
    content_ru = RichTextField(verbose_name="Полное описание (RU)")
    content_en = RichTextField(verbose_name="Полное описание (EN)")
    
    image = models.ImageField(upload_to='grants/', verbose_name="Изображение", blank=True, null=True)
    
    # Параметры гранта
    amount = models.CharField(max_length=100, verbose_name="Сумма гранта")
    duration = models.CharField(max_length=100, verbose_name="Длительность")
    deadline = models.DateField(verbose_name="Срок подачи")
    
    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('closed', 'Закрыт'),
        ('upcoming', 'Скоро'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    
    CATEGORY_CHOICES = [
        ('innovation', 'Инновации'),
        ('ecology', 'Экология'),
        ('digital', 'Цифровизация'),
        ('social', 'Социальные'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    applicants = models.IntegerField(default=0, verbose_name="Количество заявок")
    
    class Meta:
        db_table = 'content_grants'
        verbose_name = "Грант"
        verbose_name_plural = "Гранты"
        ordering = ['-deadline']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Scholarship(BaseModel):
    """Стипендии для образования"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Название (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Название (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Название (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Полное описание (UZ)")
    content_ru = RichTextField(verbose_name="Полное описание (RU)")
    content_en = RichTextField(verbose_name="Полное описание (EN)")
    
    image = models.ImageField(upload_to='scholarships/', verbose_name="Изображение", blank=True, null=True)
    
    # Параметры стипендии
    amount = models.CharField(max_length=100, verbose_name="Сумма стипендии")
    duration = models.CharField(max_length=100, verbose_name="Длительность")
    deadline = models.DateField(verbose_name="Срок подачи")
    
    STATUS_CHOICES = [
        ('active', 'Активная'),
        ('closed', 'Закрыта'),
        ('upcoming', 'Скоро'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    
    CATEGORY_CHOICES = [
        ('master', 'Магистратура'),
        ('certification', 'Сертификация'),
        ('language', 'Языки'),
        ('professional', 'Профессиональное'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    recipients = models.IntegerField(default=0, verbose_name="Количество стипендиатов")
    
    class Meta:
        db_table = 'content_scholarships'
        verbose_name = "Стипендия"
        verbose_name_plural = "Стипендии"
        ordering = ['-deadline']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Competition(BaseModel):
    """Конкурсы для молодежи"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Название (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Название (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Название (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Полное описание (UZ)")
    content_ru = RichTextField(verbose_name="Полное описание (RU)")
    content_en = RichTextField(verbose_name="Полное описание (EN)")
    
    image = models.ImageField(upload_to='competitions/', verbose_name="Изображение", blank=True, null=True)
    
    # Даты конкурса
    start_date = models.DateField(verbose_name="Дата начала")
    end_date = models.DateField(verbose_name="Дата окончания")
    registration_deadline = models.DateField(verbose_name="Срок регистрации")
    
    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('upcoming', 'Скоро'),
        ('closed', 'Завершен'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    
    CATEGORY_CHOICES = [
        ('professional', 'Профессиональный'),
        ('innovation', 'Инновации'),
        ('sports', 'Спорт'),
        ('social', 'Социальный'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    participants = models.IntegerField(default=0, verbose_name="Количество участников")
    prize = models.CharField(max_length=200, verbose_name="Приз")
    
    class Meta:
        db_table = 'content_competitions'
        verbose_name = "Конкурс"
        verbose_name_plural = "Конкурсы"
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Innovation(BaseModel):
    """Инновации компании"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Название (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Название (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Название (EN)")
    
    content_uz = RichTextField(verbose_name="Описание (UZ)")
    content_ru = RichTextField(verbose_name="Описание (RU)")
    content_en = RichTextField(verbose_name="Описание (EN)")
    
    image = models.ImageField(upload_to='innovations/', verbose_name="Изображение", blank=True, null=True)
    
    date = models.DateField(verbose_name="Дата")
    
    # Статистика
    likes = models.IntegerField(default=0, verbose_name="Лайки")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    CATEGORY_CHOICES = [
        ('technology', 'Технологии'),
        ('ecology', 'Экология'),
        ('digital', 'Цифровизация'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    is_featured = models.BooleanField(default=False, verbose_name="Избранное")
    
    class Meta:
        db_table = 'content_innovations'
        verbose_name = "Инновация"
        verbose_name_plural = "Инновации"
        ordering = ['-date']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Internship(BaseModel):
    """Стажировки"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Название (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Название (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Название (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Полное описание (UZ)")
    content_ru = RichTextField(verbose_name="Полное описание (RU)")
    content_en = RichTextField(verbose_name="Полное описание (EN)")
    
    image = models.ImageField(upload_to='internships/', verbose_name="Изображение", blank=True, null=True)
    
    # Параметры стажировки
    stipend = models.CharField(max_length=100, verbose_name="Стипендия")
    duration = models.CharField(max_length=100, verbose_name="Длительность")
    deadline = models.DateField(verbose_name="Срок подачи заявок")
    start_date = models.DateField(verbose_name="Дата начала")
    
    STATUS_CHOICES = [
        ('active', 'Активная'),
        ('closed', 'Закрыта'),
        ('upcoming', 'Скоро'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    
    CATEGORY_CHOICES = [
        ('summer', 'Летняя'),
        ('international', 'Международная'),
        ('technical', 'Техническая'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    applicants = models.IntegerField(default=0, verbose_name="Количество заявок")
    positions = models.IntegerField(default=1, verbose_name="Количество мест")
    
    class Meta:
        db_table = 'content_internships'
        verbose_name = "Стажировка"
        verbose_name_plural = "Стажировки"
        ordering = ['-deadline']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Job(BaseModel):
    """Вакансии"""
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Название (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Название (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Название (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Полное описание (UZ)")
    content_ru = RichTextField(verbose_name="Полное описание (RU)")
    content_en = RichTextField(verbose_name="Полное описание (EN)")
    
    image = models.ImageField(upload_to='jobs/', verbose_name="Изображение")
    
    # Параметры вакансии
    salary = models.CharField(max_length=100, verbose_name="Зарплата")
    location = models.CharField(max_length=200, verbose_name="Локация")
    type = models.CharField(max_length=100, verbose_name="Тип занятости")
    experience = models.CharField(max_length=100, verbose_name="Опыт работы")
    deadline = models.DateField(verbose_name="Срок подачи")
    
    STATUS_CHOICES = [
        ('active', 'Активная'),
        ('closed', 'Закрыта'),
        ('paused', 'Приостановлена'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    
    CATEGORY_CHOICES = [
        ('it', 'IT'),
        ('engineering', 'Инженерия'),
        ('hr', 'HR'),
        ('marketing', 'Маркетинг'),
        ('finance', 'Финансы'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('full-time', 'Полная занятость'),
        ('part-time', 'Частичная занятость'),
        ('contract', 'Контракт'),
        ('intern', 'Стажировка'),
    ]
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='full-time', verbose_name="Тип занятости")
    
    applicants = models.IntegerField(default=0, verbose_name="Количество заявок")
    positions = models.IntegerField(default=1, verbose_name="Количество позиций")
    
    class Meta:
        db_table = 'content_jobs'
        verbose_name = "Вакансия"
        verbose_name_plural = "Вакансии"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class TeamMember(BaseModel):
    """Члены команды"""
    
    # ФИО на разных языках
    name_uz = models.CharField(max_length=200, verbose_name="ФИО (UZ)")
    name_ru = models.CharField(max_length=200, verbose_name="ФИО (RU)")
    name_en = models.CharField(max_length=200, verbose_name="ФИО (EN)")
    
    # Должность на разных языках
    position_uz = models.CharField(max_length=200, verbose_name="Должность (UZ)")
    position_ru = models.CharField(max_length=200, verbose_name="Должность (RU)")
    position_en = models.CharField(max_length=200, verbose_name="Должность (EN)")
    
    # Биография
    bio_uz = models.TextField(blank=True, verbose_name="Биография (UZ)")
    bio_ru = models.TextField(blank=True, verbose_name="Биография (RU)")
    bio_en = models.TextField(blank=True, verbose_name="Биография (EN)")
    
    photo = models.ImageField(upload_to='team/', verbose_name="Фото")
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=50, blank=True, verbose_name="Телефон")
    
    # Социальные сети
    linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
    telegram = models.CharField(max_length=100, blank=True, verbose_name="Telegram")
    
    order = models.IntegerField(default=0, verbose_name="Порядок отображения")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    
    class Meta:
        db_table = 'content_team_members'
        verbose_name = "Член команды"
        verbose_name_plural = "Команда"
        ordering = ['order', 'name_ru']
    
    def __str__(self):
        return self.name_ru or self.name_uz or self.name_en


class AboutPage(BaseModel):
    """О компании - единственная запись"""
    
    # О компании
    about_uz = RichTextField(verbose_name="О компании (UZ)")
    about_ru = RichTextField(verbose_name="О компании (RU)")
    about_en = RichTextField(verbose_name="О компании (EN)")
    
    # Миссия
    mission_uz = RichTextField(verbose_name="Миссия (UZ)")
    mission_ru = RichTextField(verbose_name="Миссия (RU)")
    mission_en = RichTextField(verbose_name="Миссия (EN)")
    
    # Видение
    vision_uz = RichTextField(verbose_name="Видение (UZ)")
    vision_ru = RichTextField(verbose_name="Видение (RU)")
    vision_en = RichTextField(verbose_name="Видение (EN)")
    
    # История
    history_uz = RichTextField(verbose_name="История (UZ)")
    history_ru = RichTextField(verbose_name="История (RU)")
    history_en = RichTextField(verbose_name="История (EN)")
    
    # Изображения
    hero_image = models.ImageField(upload_to='about/', verbose_name="Главное изображение")
    logo = models.ImageField(upload_to='about/', verbose_name="Логотип")
    
    # Статистика компании
    employees_count = models.IntegerField(default=0, verbose_name="Количество сотрудников")
    projects_count = models.IntegerField(default=0, verbose_name="Количество проектов")
    years_experience = models.IntegerField(default=0, verbose_name="Лет опыта")
    
    # Контакты
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=50, verbose_name="Телефон")
    address_uz = models.TextField(verbose_name="Адрес (UZ)")
    address_ru = models.TextField(verbose_name="Адрес (RU)")
    address_en = models.TextField(verbose_name="Адрес (EN)")
    
    # Социальные сети
    facebook = models.URLField(blank=True, verbose_name="Facebook")
    instagram = models.URLField(blank=True, verbose_name="Instagram")
    linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
    telegram = models.URLField(blank=True, verbose_name="Telegram")
    youtube = models.URLField(blank=True, verbose_name="YouTube")
    
    class Meta:
        db_table = 'content_about_page'
        verbose_name = "О компании"
        verbose_name_plural = "О компании"
    
    def __str__(self):
        return "Информация о компании"
    
    def save(self, *args, **kwargs):
        # Разрешаем только одну запись
        if not self.pk and AboutPage.objects.exists():
            raise ValueError('Может существовать только одна запись "О компании"')
        return super().save(*args, **kwargs)


class Article(BaseModel):
    """Xalqaro va mahalliy maqolalar (foydalanuvchilar tomonidan yuklangan)"""
    
    # Foydalanuvchi ma'lumotlari
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='articles', verbose_name="Muallif")
    
    # Mультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Sarlavha (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Sarlavha (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Sarlavha (EN)")
    
    abstract_uz = models.TextField(verbose_name="Annotatsiya (UZ)")
    abstract_ru = models.TextField(verbose_name="Annotatsiya (RU)")
    abstract_en = models.TextField(verbose_name="Annotatsiya (EN)")
    
    content_uz = RichTextField(verbose_name="To'liq matn (UZ)")
    content_ru = RichTextField(verbose_name="To'liq matn (RU)")
    content_en = RichTextField(verbose_name="To'liq matn (EN)")
    
    # Fayllar
    pdf_file = models.FileField(upload_to='articles/pdfs/', verbose_name="PDF fayl", blank=True, null=True)
    cover_image = models.ImageField(upload_to='articles/covers/', verbose_name="Muqova rasmi", blank=True, null=True)
    
    # Kategoriyalar
    CATEGORY_CHOICES = [
        ('international', 'Xalqaro'),
        ('local', 'Mahalliy'),
        ('scientific', 'Ilmiy'),
        ('analytical', 'Tahliliy'),
        ('practical', 'Amaliy'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Kategoriya")
    
    # Qo'shimcha ma'lumotlar
    keywords_uz = models.CharField(max_length=500, verbose_name="Kalit so'zlar (UZ)", blank=True)
    keywords_ru = models.CharField(max_length=500, verbose_name="Kalit so'zlar (RU)", blank=True)
    keywords_en = models.CharField(max_length=500, verbose_name="Kalit so'zlar (EN)", blank=True)
    
    doi = models.CharField(max_length=100, verbose_name="DOI", blank=True)
    publication_date = models.DateField(verbose_name="Nashr sanasi", null=True, blank=True)
    
    # Moderatsiya holati
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('approved', 'Tasdiqlangan'),
        ('rejected', 'Rad etilgan'),
        ('revision', 'Qayta ko\'rib chiqish'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Holati")
    
    # Admin izohi
    admin_comment = models.TextField(verbose_name="Admin izohi", blank=True)
    approved_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, 
                                   related_name='approved_articles', verbose_name="Tasdiqlagan")
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name="Tasdiqlangan vaqt")
    
    # Statistika
    views = models.IntegerField(default=0, verbose_name="Ko'rishlar")
    downloads = models.IntegerField(default=0, verbose_name="Yuklab olishlar")
    likes = models.IntegerField(default=0, verbose_name="Yoqishlar")
    
    # Nashr qilish
    is_published = models.BooleanField(default=False, verbose_name="Nashr qilingan")
    is_featured = models.BooleanField(default=False, verbose_name="Tanlangan")
    
    class Meta:
        db_table = 'content_articles'
        verbose_name = "Maqola"
        verbose_name_plural = "Maqolalar"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'is_published']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['author', 'status']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title_uz or self.title_ru or self.title_en} - {self.get_status_display()}"


# Импортируем модель заявок
from .models_applications import Application

__all__ = [
    'News', 'Grant', 'Scholarship', 'Competition', 'Innovation',
    'Internship', 'Job', 'TeamMember', 'AboutPage', 'Application', 'Article'
]

