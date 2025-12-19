# Generated migration for Appeal model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('content', '0015_youthstatisticshistory'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appeal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
                ('language', models.CharField(
                    choices=[('uz', "O'zbekcha"), ('ru', 'Русский'), ('en', 'English')],
                    default='uz',
                    max_length=2,
                    verbose_name='Язык обращения'
                )),
                ('subject', models.CharField(max_length=500, verbose_name='Тема')),
                ('message', models.TextField(verbose_name='Сообщение')),
                ('is_anonymous', models.BooleanField(default=False, verbose_name='Анонимное обращение')),
                ('status', models.CharField(
                    choices=[
                        ('new', 'Новое'),
                        ('in_progress', 'В работе'),
                        ('resolved', 'Решено'),
                        ('rejected', 'Отклонено')
                    ],
                    default='new',
                    max_length=20,
                    verbose_name='Статус'
                )),
                ('admin_response', models.TextField(blank=True, verbose_name='Ответ администратора')),
                ('resolved_at', models.DateTimeField(blank=True, null=True, verbose_name='Дата решения')),
                ('resolved_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='resolved_appeals',
                    to=settings.AUTH_USER_MODEL,
                    verbose_name='Решено пользователем'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='appeals',
                    to=settings.AUTH_USER_MODEL,
                    verbose_name='Пользователь'
                )),
            ],
            options={
                'verbose_name': 'Обращение',
                'verbose_name_plural': 'Обращения',
                'db_table': 'content_appeals',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='appeal',
            index=models.Index(fields=['status', '-created_at'], name='content_app_status_idx'),
        ),
        migrations.AddIndex(
            model_name='appeal',
            index=models.Index(fields=['user', '-created_at'], name='content_app_user_idx'),
        ),
        migrations.AddIndex(
            model_name='appeal',
            index=models.Index(fields=['is_anonymous'], name='content_app_is_anon_idx'),
        ),
    ]

