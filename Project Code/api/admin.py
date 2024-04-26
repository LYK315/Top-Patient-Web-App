from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class UserAdmin(admin.ModelAdmin):
  list_display = ['id', 'email', 'userType']
  list_display_links = ['email']

class PatientAdmin(admin.ModelAdmin):
  list_display = ['id', 'user', 'nhsNumber', 'neptsValid']
  list_display_links = ['user']

class AppointmentAdmin(admin.ModelAdmin):
  list_display = ['id', 'refID', 'apptDate', 'apptTime']
  list_display_links = ['refID']

class AppointmentPatientAdmin(admin.ModelAdmin):
  list_display = ['id', 'apptID', 'patient']
  list_display_links = ['apptID']

class AppointmentStaffAdmin(admin.ModelAdmin):
  list_display = ['id', 'nhsNumber', 'apptID', 'email']
  list_display_links = ['apptID']

class RoutingScheduleAdmin(admin.ModelAdmin):
  list_display = ['date', 'updateTime', 'numPatient', 'addressList', 'escortList', 'schedule', 'totalTime']
  list_display_links = ['date']

admin.site.register(User, UserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(AppointmentPatient, AppointmentPatientAdmin)
admin.site.register(AppointmentStaff, AppointmentStaffAdmin)
admin.site.register(RoutingSchedule, RoutingScheduleAdmin)
