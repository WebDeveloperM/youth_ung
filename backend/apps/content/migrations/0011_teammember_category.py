# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0010_article'),
    ]

    operations = [
        migrations.AddField(
            model_name='teammember',
            name='category',
            field=models.CharField(
                choices=[
                    ('leadership', 'Руководство'),
                    ('innovation', 'Инновации'),
                    ('education', 'Образование'),
                    ('media', 'Медиа'),
                    ('sports', 'Спорт')
                ],
                default='leadership',
                max_length=50,
                verbose_name='Категория'
            ),
        ),
    ]

