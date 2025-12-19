# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('organisation', '0002_remove_organisation_department_and_more'),
        ('users', '0003_user_allowed_menus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='organization',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='organisation.organisation'
            ),
        ),
        migrations.AlterField(
            model_name='user',
            name='position',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]

