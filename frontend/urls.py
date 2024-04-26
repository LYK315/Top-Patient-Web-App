from django.urls import path
from .views import index
from django.urls import re_path
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    # Main Pages
    path('', index),
    path('our-services', index),
    path('nepts', index),
    path('about-us', index),

    # NEPTS Info
    path('nepts-how-to-book', index),
    path('nepts-eligibility', index),

    # Patient Zone
    path('patient-zone', index), # Log in
    path('patient-zone/nepts', index), # Book NEPTS
    path('patient-zone/patientDashboard', index), # Patient Dashboard
    path('patient-zone/profile', index), # Patient Profile
    path('patient-zone/appointments', index), # Up coming appt  

    # Staff Zone
    path('staff-zone', index), # Log in
    path('staff-zone/nepts', index), # Staff Manually Book NEPTS
    path('staff-zone/staffDashboard', index), # Staff Dashboard
    path('staff-zone/routing-schedule', index),  # Routing Schedule
    path('staff-zone/routing-schedule/<str:date>', index),  # Routing Schedule - Specific Date
    path('staff-zone/manage-staff', index),  # Manage Staff
    path('staff-zone/patient-application', index), # Review Patient NEPTS Eligibility

    re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}),
]