# Generated by Django 4.1 on 2023-12-23 23:27

import api.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_rename_currentsituation_combineuserpatient_currentcondition'),
    ]

    operations = [
        migrations.CreateModel(
            name='StaffAddAppointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nhsNumber', models.CharField(default='0000000000', max_length=10, unique=True, validators=[django.core.validators.MinLengthValidator(10)])),
                ('birthDate', models.DateField(default=(2001, 3, 15))),
                ('fullName', models.CharField(default='fname', max_length=400)),
                ('gender', models.CharField(default='gender', max_length=10)),
                ('contact', models.CharField(default='999', max_length=15)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('apptRefID', models.CharField(default=api.models.generate_ref_id, max_length=8, unique=True)),
                ('apptDate', models.DateField(default=(2001, 3, 15))),
                ('apptTime', models.TimeField(default=(0, 0, 0))),
                ('apptEndTime', models.TimeField(default=(0, 0, 0))),
                ('addrPickUp', models.TextField(default='', max_length=1000)),
                ('addrAppt', models.TextField(default='', max_length=1000)),
                ('gpName', models.CharField(default='', max_length=200)),
                ('disability', models.IntegerField(default=-1)),
                ('escort', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, default='', max_length=1000)),
                ('specialReq', models.TextField(blank=True, default='', max_length=1000)),
            ],
        ),
    ]
