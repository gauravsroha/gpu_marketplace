# Generated by Django 5.1.1 on 2024-10-06 05:53

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_gpulisting_end_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gpulisting',
            name='end_time',
            field=models.DateTimeField(default=datetime.datetime(2024, 10, 13, 5, 53, 39, 902658, tzinfo=datetime.timezone.utc)),
        ),
    ]
