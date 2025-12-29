# Generated migration to add sources field to SupplyChainReport

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplychainreport',
            name='sources',
            field=models.JSONField(default=list, help_text='Source articles with URL and title'),
        ),
    ]
