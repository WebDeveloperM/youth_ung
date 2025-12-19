# Generated manually

from django.db import migrations, models
import ckeditor.fields


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0011_teammember_category'),
    ]

    operations = [
        # Technology model
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('title_uz', models.CharField(max_length=500, verbose_name='Заголовок (UZ)')),
                ('title_ru', models.CharField(max_length=500, verbose_name='Заголовок (RU)')),
                ('title_en', models.CharField(max_length=500, verbose_name='Заголовок (EN)')),
                ('short_description_uz', models.TextField(verbose_name='Краткое описание (UZ)')),
                ('short_description_ru', models.TextField(verbose_name='Краткое описание (RU)')),
                ('short_description_en', models.TextField(verbose_name='Краткое описание (EN)')),
                ('content_uz', ckeditor.fields.RichTextField(verbose_name='Контент (UZ)')),
                ('content_ru', ckeditor.fields.RichTextField(verbose_name='Контент (RU)')),
                ('content_en', ckeditor.fields.RichTextField(verbose_name='Контент (EN)')),
                ('image', models.ImageField(blank=True, null=True, upload_to='technologies/', verbose_name='Изображение')),
                ('category', models.CharField(choices=[('exploration', 'Разведка'), ('drilling', 'Бурение'), ('extraction', 'Добыча'), ('ecology', 'Экология'), ('automation', 'Автоматизация'), ('processing', 'Переработка')], max_length=50, verbose_name='Категория')),
                ('date', models.DateField(verbose_name='Дата внедрения')),
                ('likes', models.IntegerField(default=0, verbose_name='Лайки')),
                ('views', models.IntegerField(default=0, verbose_name='Просмотры')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликовано')),
                ('is_featured', models.BooleanField(default=False, verbose_name='Избранное')),
            ],
            options={
                'verbose_name': 'Технология',
                'verbose_name_plural': 'Технологии',
                'db_table': 'content_technologies',
                'ordering': ['-date'],
            },
        ),
        
        # Project model
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('title_uz', models.CharField(max_length=500, verbose_name='Заголовок (UZ)')),
                ('title_ru', models.CharField(max_length=500, verbose_name='Заголовок (RU)')),
                ('title_en', models.CharField(max_length=500, verbose_name='Заголовок (EN)')),
                ('short_description_uz', models.TextField(verbose_name='Краткое описание (UZ)')),
                ('short_description_ru', models.TextField(verbose_name='Краткое описание (RU)')),
                ('short_description_en', models.TextField(verbose_name='Краткое описание (EN)')),
                ('content_uz', ckeditor.fields.RichTextField(verbose_name='Контент (UZ)')),
                ('content_ru', ckeditor.fields.RichTextField(verbose_name='Контент (RU)')),
                ('content_en', ckeditor.fields.RichTextField(verbose_name='Контент (EN)')),
                ('image', models.ImageField(blank=True, null=True, upload_to='projects/', verbose_name='Изображение')),
                ('category', models.CharField(choices=[('infrastructure', 'Инфраструктура'), ('digital', 'Цифровизация'), ('ecology', 'Экология'), ('education', 'Образование')], max_length=50, verbose_name='Категория')),
                ('budget', models.CharField(max_length=100, verbose_name='Бюджет')),
                ('duration', models.CharField(max_length=100, verbose_name='Длительность')),
                ('status', models.CharField(choices=[('active', 'Активный'), ('completed', 'Завершен'), ('planned', 'Запланирован'), ('paused', 'Приостановлен')], default='active', max_length=50, verbose_name='Статус')),
                ('progress', models.IntegerField(default=0, verbose_name='Прогресс (%)')),
                ('team', models.IntegerField(default=0, verbose_name='Размер команды')),
                ('location', models.CharField(max_length=200, verbose_name='Местоположение')),
                ('start_date', models.DateField(verbose_name='Дата начала')),
                ('end_date', models.DateField(verbose_name='Дата окончания')),
                ('likes', models.IntegerField(default=0, verbose_name='Лайки')),
                ('views', models.IntegerField(default=0, verbose_name='Просмотры')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликовано')),
                ('is_featured', models.BooleanField(default=False, verbose_name='Избранное')),
            ],
            options={
                'verbose_name': 'Проект',
                'verbose_name_plural': 'Проекты',
                'db_table': 'content_projects',
                'ordering': ['-start_date'],
            },
        ),
        
        # Research model
        migrations.CreateModel(
            name='Research',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('title_uz', models.CharField(max_length=500, verbose_name='Заголовок (UZ)')),
                ('title_ru', models.CharField(max_length=500, verbose_name='Заголовок (RU)')),
                ('title_en', models.CharField(max_length=500, verbose_name='Заголовок (EN)')),
                ('short_description_uz', models.TextField(verbose_name='Краткое описание (UZ)')),
                ('short_description_ru', models.TextField(verbose_name='Краткое описание (RU)')),
                ('short_description_en', models.TextField(verbose_name='Краткое описание (EN)')),
                ('content_uz', ckeditor.fields.RichTextField(verbose_name='Контент (UZ)')),
                ('content_ru', ckeditor.fields.RichTextField(verbose_name='Контент (RU)')),
                ('content_en', ckeditor.fields.RichTextField(verbose_name='Контент (EN)')),
                ('image', models.ImageField(blank=True, null=True, upload_to='research/', verbose_name='Изображение')),
                ('category', models.CharField(choices=[('technology', 'Технологии'), ('ecology', 'Экология'), ('digital', 'Цифровизация'), ('geology', 'Геология')], max_length=50, verbose_name='Категория')),
                ('authors', models.TextField(verbose_name='Авторы')),
                ('department', models.CharField(max_length=200, verbose_name='Отдел')),
                ('start_date', models.DateField(verbose_name='Дата начала')),
                ('end_date', models.DateField(verbose_name='Дата окончания')),
                ('status', models.CharField(choices=[('active', 'Активное'), ('completed', 'Завершено'), ('planned', 'Запланировано')], default='active', max_length=50, verbose_name='Статус')),
                ('publications', models.IntegerField(default=0, verbose_name='Публикации')),
                ('citations', models.IntegerField(default=0, verbose_name='Цитирования')),
                ('budget', models.CharField(max_length=100, verbose_name='Бюджет')),
                ('likes', models.IntegerField(default=0, verbose_name='Лайки')),
                ('views', models.IntegerField(default=0, verbose_name='Просмотры')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликовано')),
                ('is_featured', models.BooleanField(default=False, verbose_name='Избранное')),
            ],
            options={
                'verbose_name': 'Исследование',
                'verbose_name_plural': 'Исследования',
                'db_table': 'content_research',
                'ordering': ['-start_date'],
            },
        ),
        
        # Result model
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('title_uz', models.CharField(max_length=500, verbose_name='Заголовок (UZ)')),
                ('title_ru', models.CharField(max_length=500, verbose_name='Заголовок (RU)')),
                ('title_en', models.CharField(max_length=500, verbose_name='Заголовок (EN)')),
                ('short_description_uz', models.TextField(verbose_name='Краткое описание (UZ)')),
                ('short_description_ru', models.TextField(verbose_name='Краткое описание (RU)')),
                ('short_description_en', models.TextField(verbose_name='Краткое описание (EN)')),
                ('content_uz', ckeditor.fields.RichTextField(verbose_name='Контент (UZ)')),
                ('content_ru', ckeditor.fields.RichTextField(verbose_name='Контент (RU)')),
                ('content_en', ckeditor.fields.RichTextField(verbose_name='Контент (EN)')),
                ('image', models.ImageField(blank=True, null=True, upload_to='results/', verbose_name='Изображение')),
                ('category', models.CharField(choices=[('project', 'Проект'), ('program', 'Программа'), ('research', 'Исследование'), ('ecology', 'Экология')], max_length=50, verbose_name='Категория')),
                ('status', models.CharField(choices=[('completed', 'Завершено'), ('ongoing', 'В процессе')], default='completed', max_length=50, verbose_name='Статус')),
                ('year', models.IntegerField(verbose_name='Год')),
                ('metrics', models.JSONField(blank=True, default=dict, verbose_name='Метрики')),
                ('achievements', models.JSONField(blank=True, default=list, verbose_name='Достижения')),
                ('likes', models.IntegerField(default=0, verbose_name='Лайки')),
                ('views', models.IntegerField(default=0, verbose_name='Просмотры')),
                ('is_published', models.BooleanField(default=True, verbose_name='Опубликовано')),
                ('is_featured', models.BooleanField(default=False, verbose_name='Избранное')),
            ],
            options={
                'verbose_name': 'Результат',
                'verbose_name_plural': 'Результаты',
                'db_table': 'content_results',
                'ordering': ['-year', '-created_at'],
            },
        ),
    ]

