# Generated by Django 4.1 on 2023-12-07 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_appointment'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='specialReq',
            field=models.TextField(default='', max_length=1000),
        ),
    ]
