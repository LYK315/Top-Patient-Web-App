# Generated by Django 4.1 on 2023-12-22 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_patient_neptsvalid'),
    ]

    operations = [
        migrations.AddField(
            model_name='combineuserpatient',
            name='currentSituation',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='patient',
            name='currentSituation',
            field=models.TextField(default=''),
        ),
    ]
