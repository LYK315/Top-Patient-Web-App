from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinLengthValidator
import random
import string

# User Type
# 0 - Application Admin
# 1 - Senior Staff
# 2 - Staff
# 3 - Patient

# NEPTS Eligibility
# 0 - Pending
# 1 - Eligible
# 2 - Not Eligible


# Password is automatically inherited, dont have to specifically mention
# Custom User Manager
class UserManager (BaseUserManager):
    def create_user(self, email, password, userType, first_name, last_name):
        if not email:
            raise ValueError("Email is required.")
        user = self.model(email=email, userType=userType,
                          first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.is_staff = False
        user.is_superuser = False
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, userType, first_name, last_name):
        user = self.create_user(
            email, password, userType, first_name, last_name)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# Custom User Model
class User(AbstractUser):
    email = models.EmailField(unique=True, null=False)
    userType = models.IntegerField(default=-1, null=False)
    first_name = models.CharField(default="fname", max_length=200, null=False)
    last_name = models.CharField(default="lname", max_length=200, null=False)
    username = models.CharField(unique=False, max_length=200)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['userType', 'first_name', 'last_name']
    objects = UserManager()

# Patient Model
class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nhsNumber = models.CharField(max_length=10, validators=[MinLengthValidator(10)], default='0000000000', unique=True)
    gender = models.CharField(null=False, max_length=10, default='gender')
    birthDate = models.DateField(null=False, default=(2001, 3, 15))
    disability = models.IntegerField(null=False, default=1)
    contact = models.CharField(max_length=15, default="999")
    neptsValid = models.IntegerField(default=0, null=True)
    currentCondition = models.TextField(default='', null=False)


# Combine User & Patient Model (to create user and patient simultaneously when user register)
class CombineUserPatient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, null=False)
    password = models.CharField(max_length=200, default="password", null=False)
    userType = models.IntegerField(default=-1, null=False)
    first_name = models.CharField(default="fname", max_length=200, null=False)
    last_name = models.CharField(default="lname", max_length=200, null=False)
    nhsNumber = models.CharField(max_length=10, validators=[
                                 MinLengthValidator(10)], default='0000000000', unique=True)
    gender = models.CharField(null=False, max_length=10, default='gender')
    birthDate = models.DateField(null=False, default=(2001, 3, 15))
    disability = models.IntegerField(null=False, default=1)
    contact = models.CharField(max_length=15, default="999")
    currentCondition = models.TextField(default='', null=False)


# Function to Generate Unique Appointment refID
def generate_ref_id():
    length = 8

    while True:
        newRefID = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Appointment.objects.filter(refID=newRefID).count() == 0:
            break
    return newRefID

# Appointment Model
class Appointment (models.Model):
    refID = models.CharField(max_length=8, default=generate_ref_id, null=False, unique=True)
    apptDate = models.DateField(default=(2001, 3, 15), null=False)
    apptTime = models.TimeField(default=(00, 00, 00), null=False)
    apptEndTime = models.TimeField(default=(00, 00, 00), null=False)
    addrPickUp = models.TextField(max_length=1000, default='', null=False)
    addrAppt = models.TextField(max_length=1000, default='', null=False)
    gpName = models.CharField(max_length=200, default='', null=False)
    disability = models.IntegerField(default=-1, null=False)
    escort = models.BooleanField(default=False, null=False)
    notes = models.TextField(max_length=1000, default='', blank=True)
    specialReq = models.TextField(max_length=1000, default='', blank=True)

# Patient-Add Appointment Model
class AppointmentPatient (models.Model):
    apptID = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

# Staff Adding Appointment Model
class AddAppointmentStaff (models.Model):
    apptID = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    nhsNumber = models.CharField(max_length=10, validators=[MinLengthValidator(10)], default='0000000000')
    birthDate = models.DateField(null=False, default=(2001, 3, 15))
    fullName = models.CharField(default="fname", max_length=400, null=False)
    gender = models.CharField(null=False, max_length=10, default='gender')
    contact = models.CharField(max_length=15, default="999")
    email = models.EmailField(default="default@email.com", null=False)
    apptDate = models.DateField(default=(2001, 3, 15), null=False)
    apptTime = models.TimeField(default=(00, 00, 00), null=False)
    apptEndTime = models.TimeField(default=(00, 00, 00), null=False)
    addrPickUp = models.TextField(max_length=1000, default='', null=False)
    addrAppt = models.TextField(max_length=1000, default='', null=False)
    gpName = models.CharField(max_length=200, default='', null=False)
    disability = models.IntegerField(default=-1, null=False)
    escort = models.BooleanField(default=False, null=False)
    notes = models.TextField(max_length=1000, default='', blank=True)
    specialReq = models.TextField(max_length=1000, default='', blank=True)

# Patient-Add Appointment Model
class AppointmentStaff(models.Model):
    apptID = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    nhsNumber = models.CharField(max_length=10, validators=[MinLengthValidator(10)], default='0000000000')
    birthDate = models.DateField(null=False, default=(2001, 3, 15))
    fullName = models.CharField(default="fname", max_length=400, null=False)
    gender = models.CharField(null=False, max_length=10, default='gender')
    contact = models.CharField(max_length=15, default="999")
    email = models.EmailField(default="default@email.com", null=False)

# Routing Schedule Model
class RoutingSchedule(models.Model):
    date = models.DateField(unique=True, null=False, default=(2001, 3, 15))
    numPatient = models.IntegerField(default=-1, null=False)
    addressList = models.TextField(max_length=999999, default='', null=False)
    escortList = models.TextField(max_length=999999, default='', null=False)
    schedule = models.TextField(max_length=999999, default='', null=False)
    totalTime = models.FloatField(default=-1, null=False)
    updateTime = models.DateTimeField(default=(2001, 3, 15, 15, 30))
