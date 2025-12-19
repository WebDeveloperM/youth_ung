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
    
    CATEGORY_CHOICES = [
        ('leadership', 'Руководство'),
        ('innovation', 'Инновации'),
        ('education', 'Образование'),
        ('media', 'Медиа'),
        ('sports', 'Спорт'),
    ]
    
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
    
    # Категория/Отдел
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='leadership',
        verbose_name="Категория"
    )
    
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


class Technology(BaseModel):
    """Технологии компании"""
    
    CATEGORY_CHOICES = [
        ('exploration', 'Разведка'),
        ('drilling', 'Бурение'),
        ('extraction', 'Добыча'),
        ('ecology', 'Экология'),
        ('automation', 'Автоматизация'),
        ('processing', 'Переработка'),
    ]
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Заголовок (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Заголовок (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Контент (UZ)")
    content_ru = RichTextField(verbose_name="Контент (RU)")
    content_en = RichTextField(verbose_name="Контент (EN)")
    
    image = models.ImageField(upload_to='technologies/', verbose_name="Изображение", blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    date = models.DateField(verbose_name="Дата внедрения")
    
    # Статистика
    likes = models.IntegerField(default=0, verbose_name="Лайки")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Статус публикации
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")
    is_featured = models.BooleanField(default=False, verbose_name="Избранное")
    
    class Meta:
        db_table = 'content_technologies'
        verbose_name = "Технология"
        verbose_name_plural = "Технологии"
        ordering = ['-date']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Project(BaseModel):
    """Проекты компании"""
    
    CATEGORY_CHOICES = [
        ('infrastructure', 'Инфраструктура'),
        ('digital', 'Цифровизация'),
        ('ecology', 'Экология'),
        ('education', 'Образование'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Активный'),
        ('completed', 'Завершен'),
        ('planned', 'Запланирован'),
        ('paused', 'Приостановлен'),
    ]
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Заголовок (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Заголовок (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Контент (UZ)")
    content_ru = RichTextField(verbose_name="Контент (RU)")
    content_en = RichTextField(verbose_name="Контент (EN)")
    
    image = models.ImageField(upload_to='projects/', verbose_name="Изображение", blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    # Детали проекта
    budget = models.CharField(max_length=100, verbose_name="Бюджет")
    duration = models.CharField(max_length=100, verbose_name="Длительность")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    progress = models.IntegerField(default=0, verbose_name="Прогресс (%)")
    team = models.IntegerField(default=0, verbose_name="Размер команды")
    location = models.CharField(max_length=200, verbose_name="Местоположение")
    start_date = models.DateField(verbose_name="Дата начала")
    end_date = models.DateField(verbose_name="Дата окончания")
    
    # Статистика
    likes = models.IntegerField(default=0, verbose_name="Лайки")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Статус публикации
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")
    is_featured = models.BooleanField(default=False, verbose_name="Избранное")
    
    class Meta:
        db_table = 'content_projects'
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Research(BaseModel):
    """Исследования компании"""
    
    CATEGORY_CHOICES = [
        ('technology', 'Технологии'),
        ('ecology', 'Экология'),
        ('digital', 'Цифровизация'),
        ('geology', 'Геология'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Активное'),
        ('completed', 'Завершено'),
        ('planned', 'Запланировано'),
    ]
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Заголовок (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Заголовок (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Контент (UZ)")
    content_ru = RichTextField(verbose_name="Контент (RU)")
    content_en = RichTextField(verbose_name="Контент (EN)")
    
    image = models.ImageField(upload_to='research/', verbose_name="Изображение", blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    
    # Детали исследования
    authors = models.TextField(verbose_name="Авторы")
    department = models.CharField(max_length=200, verbose_name="Отдел")
    start_date = models.DateField(verbose_name="Дата начала")
    end_date = models.DateField(verbose_name="Дата окончания")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active', verbose_name="Статус")
    publications = models.IntegerField(default=0, verbose_name="Публикации")
    citations = models.IntegerField(default=0, verbose_name="Цитирования")
    budget = models.CharField(max_length=100, verbose_name="Бюджет")
    
    # Статистика
    likes = models.IntegerField(default=0, verbose_name="Лайки")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Статус публикации
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")
    is_featured = models.BooleanField(default=False, verbose_name="Избранное")
    
    class Meta:
        db_table = 'content_research'
        verbose_name = "Исследование"
        verbose_name_plural = "Исследования"
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


class Result(BaseModel):
    """Результаты проектов и исследований"""
    
    CATEGORY_CHOICES = [
        ('project', 'Проект'),
        ('program', 'Программа'),
        ('research', 'Исследование'),
        ('ecology', 'Экология'),
    ]
    
    STATUS_CHOICES = [
        ('completed', 'Завершено'),
        ('ongoing', 'В процессе'),
    ]
    
    # Мультиязычные поля
    title_uz = models.CharField(max_length=500, verbose_name="Заголовок (UZ)")
    title_ru = models.CharField(max_length=500, verbose_name="Заголовок (RU)")
    title_en = models.CharField(max_length=500, verbose_name="Заголовок (EN)")
    
    short_description_uz = models.TextField(verbose_name="Краткое описание (UZ)")
    short_description_ru = models.TextField(verbose_name="Краткое описание (RU)")
    short_description_en = models.TextField(verbose_name="Краткое описание (EN)")
    
    content_uz = RichTextField(verbose_name="Контент (UZ)")
    content_ru = RichTextField(verbose_name="Контент (RU)")
    content_en = RichTextField(verbose_name="Контент (EN)")
    
    image = models.ImageField(upload_to='results/', verbose_name="Изображение", blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, verbose_name="Категория")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='completed', verbose_name="Статус")
    year = models.IntegerField(verbose_name="Год")
    
    # Метрики (хранятся как JSON-строка)
    metrics = models.JSONField(default=dict, verbose_name="Метрики", blank=True)
    achievements = models.JSONField(default=list, verbose_name="Достижения", blank=True)
    
    # Статистика
    likes = models.IntegerField(default=0, verbose_name="Лайки")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Статус публикации
    is_published = models.BooleanField(default=True, verbose_name="Опубликовано")
    is_featured = models.BooleanField(default=False, verbose_name="Избранное")
    
    class Meta:
        db_table = 'content_results'
        verbose_name = "Результат"
        verbose_name_plural = "Результаты"
        ordering = ['-year', '-created_at']
    
    def __str__(self):
        return self.title_ru or self.title_uz or self.title_en


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


class YouthStatistics(models.Model):
    """Статистика по молодежи - редактируемые данные для дашборда"""
    
    # Основная статистика молодежи
    total_youth = models.IntegerField(default=0, verbose_name="Общее количество молодежи")
    male_count = models.IntegerField(default=0, verbose_name="Количество мужчин")
    female_count = models.IntegerField(default=0, verbose_name="Количество женщин")
    
    # Образование
    foreign_graduates = models.IntegerField(default=0, verbose_name="Выпускники зарубежных вузов")
    top300_graduates = models.IntegerField(default=0, verbose_name="Выпускники TOP 300 вузов")
    top500_graduates = models.IntegerField(default=0, verbose_name="Выпускники TOP 500 вузов")
    higher_education = models.IntegerField(default=0, verbose_name="С высшим образованием")
    secondary_education = models.IntegerField(default=0, verbose_name="Со средним образованием")
    
    # Сотрудники
    technical_staff = models.IntegerField(default=0, verbose_name="Технические сотрудники")
    service_staff = models.IntegerField(default=0, verbose_name="Обслуживающий персонал")
    promoted_youth = models.IntegerField(default=0, verbose_name="Повышенные в должности")
    
    # Достижения - Языковые сертификаты
    language_cert_total = models.IntegerField(default=0, verbose_name="Всего с языковыми сертификатами")
    ielts_count = models.IntegerField(default=0, verbose_name="IELTS")
    cefr_count = models.IntegerField(default=0, verbose_name="CEFR")
    topik_count = models.IntegerField(default=0, verbose_name="TOPIK")
    
    # Достижения - Научные степени
    scientific_degree_total = models.IntegerField(default=0, verbose_name="Всего с научными степенями")
    phd_count = models.IntegerField(default=0, verbose_name="PhD")
    dsc_count = models.IntegerField(default=0, verbose_name="DSc")
    candidate_count = models.IntegerField(default=0, verbose_name="Соискатели")
    
    # Достижения - Молодые лидеры
    young_leaders_total = models.IntegerField(default=0, verbose_name="Всего молодых лидеров")
    directors_count = models.IntegerField(default=0, verbose_name="Директора")
    heads_count = models.IntegerField(default=0, verbose_name="Начальники")
    managers_count = models.IntegerField(default=0, verbose_name="Менеджеры")
    
    # Достижения - Государственные награды
    state_awards_total = models.IntegerField(default=0, verbose_name="Всего награжденных")
    orders_count = models.IntegerField(default=0, verbose_name="Ордена")
    medals_count = models.IntegerField(default=0, verbose_name="Медали")
    honorary_count = models.IntegerField(default=0, verbose_name="Почетные звания")
    
    # Метаданные
    last_updated = models.DateTimeField(auto_now=True, verbose_name="Последнее обновление")
    updated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='statistics_updates',
        verbose_name="Обновлено пользователем"
    )
    
    class Meta:
        db_table = 'youth_statistics'
        verbose_name = "Статистика молодежи"
        verbose_name_plural = "Статистика молодежи"
    
    def __str__(self):
        return f"Статистика молодежи (обновлено: {self.last_updated.strftime('%d.%m.%Y %H:%M')})"
    
    @classmethod
    def get_instance(cls):
        """Получить единственный экземпляр статистики (создать если не существует)"""
        instance, created = cls.objects.get_or_create(id=1)
        return instance
    
    def save(self, *args, **kwargs):
        """Автоматически создавать запись в истории при сохранении"""
        super().save(*args, **kwargs)
        # Создаем запись в истории
        YouthStatisticsHistory.objects.create(
            statistics=self,
            total_youth=self.total_youth,
            male_count=self.male_count,
            female_count=self.female_count,
            foreign_graduates=self.foreign_graduates,
            top300_graduates=self.top300_graduates,
            top500_graduates=self.top500_graduates,
            higher_education=self.higher_education,
            secondary_education=self.secondary_education,
            technical_staff=self.technical_staff,
            service_staff=self.service_staff,
            promoted_youth=self.promoted_youth,
            language_cert_total=self.language_cert_total,
            ielts_count=self.ielts_count,
            cefr_count=self.cefr_count,
            topik_count=self.topik_count,
            scientific_degree_total=self.scientific_degree_total,
            phd_count=self.phd_count,
            dsc_count=self.dsc_count,
            candidate_count=self.candidate_count,
            young_leaders_total=self.young_leaders_total,
            directors_count=self.directors_count,
            heads_count=self.heads_count,
            managers_count=self.managers_count,
            state_awards_total=self.state_awards_total,
            orders_count=self.orders_count,
            medals_count=self.medals_count,
            honorary_count=self.honorary_count,
            updated_by=self.updated_by
        )


class YouthStatisticsHistory(models.Model):
    """История изменений статистики молодежи"""
    
    statistics = models.ForeignKey(
        YouthStatistics,
        on_delete=models.CASCADE,
        related_name='history',
        verbose_name="Статистика"
    )
    
    # Все те же поля что в YouthStatistics
    total_youth = models.IntegerField(default=0)
    male_count = models.IntegerField(default=0)
    female_count = models.IntegerField(default=0)
    foreign_graduates = models.IntegerField(default=0)
    top300_graduates = models.IntegerField(default=0)
    top500_graduates = models.IntegerField(default=0)
    higher_education = models.IntegerField(default=0)
    secondary_education = models.IntegerField(default=0)
    technical_staff = models.IntegerField(default=0)
    service_staff = models.IntegerField(default=0)
    promoted_youth = models.IntegerField(default=0)
    language_cert_total = models.IntegerField(default=0)
    ielts_count = models.IntegerField(default=0)
    cefr_count = models.IntegerField(default=0)
    topik_count = models.IntegerField(default=0)
    scientific_degree_total = models.IntegerField(default=0)
    phd_count = models.IntegerField(default=0)
    dsc_count = models.IntegerField(default=0)
    candidate_count = models.IntegerField(default=0)
    young_leaders_total = models.IntegerField(default=0)
    directors_count = models.IntegerField(default=0)
    heads_count = models.IntegerField(default=0)
    managers_count = models.IntegerField(default=0)
    state_awards_total = models.IntegerField(default=0)
    orders_count = models.IntegerField(default=0)
    medals_count = models.IntegerField(default=0)
    honorary_count = models.IntegerField(default=0)
    
    # Метаданные
    recorded_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата записи")
    updated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Кто обновил"
    )
    
    class Meta:
        db_table = 'youth_statistics_history'
        verbose_name = "История статистики"
        verbose_name_plural = "История статистики"
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['-recorded_at']),
            models.Index(fields=['statistics', '-recorded_at']),
        ]
    
    def __str__(self):
        return f"История на {self.recorded_at.strftime('%d.%m.%Y %H:%M')}"


# Импортируем модель заявок
from .models_applications import Application
# Импортируем модель обращений
from .models_appeals import Appeal

__all__ = [
    'News', 'Grant', 'Scholarship', 'Competition', 'Innovation',
    'Internship', 'Job', 'TeamMember', 'AboutPage', 'Application', 'Article',
    'YouthStatistics', 'YouthStatisticsHistory', 'Appeal'
]

