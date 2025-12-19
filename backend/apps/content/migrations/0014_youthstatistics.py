# Generated migration for YouthStatistics model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('content', '0013_project_created_by_project_updated_by_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='YouthStatistics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_youth', models.IntegerField(default=0, verbose_name='Общее количество молодежи')),
                ('male_count', models.IntegerField(default=0, verbose_name='Количество мужчин')),
                ('female_count', models.IntegerField(default=0, verbose_name='Количество женщин')),
                ('foreign_graduates', models.IntegerField(default=0, verbose_name='Выпускники зарубежных вузов')),
                ('top300_graduates', models.IntegerField(default=0, verbose_name='Выпускники TOP 300 вузов')),
                ('top500_graduates', models.IntegerField(default=0, verbose_name='Выпускники TOP 500 вузов')),
                ('higher_education', models.IntegerField(default=0, verbose_name='С высшим образованием')),
                ('secondary_education', models.IntegerField(default=0, verbose_name='Со средним образованием')),
                ('technical_staff', models.IntegerField(default=0, verbose_name='Технические сотрудники')),
                ('service_staff', models.IntegerField(default=0, verbose_name='Обслуживающий персонал')),
                ('promoted_youth', models.IntegerField(default=0, verbose_name='Повышенные в должности')),
                ('language_cert_total', models.IntegerField(default=0, verbose_name='Всего с языковыми сертификатами')),
                ('ielts_count', models.IntegerField(default=0, verbose_name='IELTS')),
                ('cefr_count', models.IntegerField(default=0, verbose_name='CEFR')),
                ('topik_count', models.IntegerField(default=0, verbose_name='TOPIK')),
                ('scientific_degree_total', models.IntegerField(default=0, verbose_name='Всего с научными степенями')),
                ('phd_count', models.IntegerField(default=0, verbose_name='PhD')),
                ('dsc_count', models.IntegerField(default=0, verbose_name='DSc')),
                ('candidate_count', models.IntegerField(default=0, verbose_name='Соискатели')),
                ('young_leaders_total', models.IntegerField(default=0, verbose_name='Всего молодых лидеров')),
                ('directors_count', models.IntegerField(default=0, verbose_name='Директора')),
                ('heads_count', models.IntegerField(default=0, verbose_name='Начальники')),
                ('managers_count', models.IntegerField(default=0, verbose_name='Менеджеры')),
                ('state_awards_total', models.IntegerField(default=0, verbose_name='Всего награжденных')),
                ('orders_count', models.IntegerField(default=0, verbose_name='Ордена')),
                ('medals_count', models.IntegerField(default=0, verbose_name='Медали')),
                ('honorary_count', models.IntegerField(default=0, verbose_name='Почетные звания')),
                ('last_updated', models.DateTimeField(auto_now=True, verbose_name='Последнее обновление')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='statistics_updates', to=settings.AUTH_USER_MODEL, verbose_name='Обновлено пользователем')),
            ],
            options={
                'verbose_name': 'Статистика молодежи',
                'verbose_name_plural': 'Статистика молодежи',
                'db_table': 'youth_statistics',
            },
        ),
    ]

