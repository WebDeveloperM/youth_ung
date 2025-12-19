# Generated migration for YouthStatisticsHistory model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('content', '0014_youthstatistics'),
    ]

    operations = [
        migrations.CreateModel(
            name='YouthStatisticsHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_youth', models.IntegerField(default=0)),
                ('male_count', models.IntegerField(default=0)),
                ('female_count', models.IntegerField(default=0)),
                ('foreign_graduates', models.IntegerField(default=0)),
                ('top300_graduates', models.IntegerField(default=0)),
                ('top500_graduates', models.IntegerField(default=0)),
                ('higher_education', models.IntegerField(default=0)),
                ('secondary_education', models.IntegerField(default=0)),
                ('technical_staff', models.IntegerField(default=0)),
                ('service_staff', models.IntegerField(default=0)),
                ('promoted_youth', models.IntegerField(default=0)),
                ('language_cert_total', models.IntegerField(default=0)),
                ('ielts_count', models.IntegerField(default=0)),
                ('cefr_count', models.IntegerField(default=0)),
                ('topik_count', models.IntegerField(default=0)),
                ('scientific_degree_total', models.IntegerField(default=0)),
                ('phd_count', models.IntegerField(default=0)),
                ('dsc_count', models.IntegerField(default=0)),
                ('candidate_count', models.IntegerField(default=0)),
                ('young_leaders_total', models.IntegerField(default=0)),
                ('directors_count', models.IntegerField(default=0)),
                ('heads_count', models.IntegerField(default=0)),
                ('managers_count', models.IntegerField(default=0)),
                ('state_awards_total', models.IntegerField(default=0)),
                ('orders_count', models.IntegerField(default=0)),
                ('medals_count', models.IntegerField(default=0)),
                ('honorary_count', models.IntegerField(default=0)),
                ('recorded_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата записи')),
                ('statistics', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='content.youthstatistics', verbose_name='Статистика')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Кто обновил')),
            ],
            options={
                'verbose_name': 'История статистики',
                'verbose_name_plural': 'История статистики',
                'db_table': 'youth_statistics_history',
                'ordering': ['-recorded_at'],
            },
        ),
        migrations.AddIndex(
            model_name='youthstatisticshistory',
            index=models.Index(fields=['-recorded_at'], name='youth_stati_recorde_idx'),
        ),
        migrations.AddIndex(
            model_name='youthstatisticshistory',
            index=models.Index(fields=['statistics', '-recorded_at'], name='youth_stati_statist_idx'),
        ),
    ]

