from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Session Tokens
    path('', GetRoutes.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Admin
    path('create-user', CreateUser.as_view()),
    path('create-admin', CreateAdmin.as_view()),

    # Patients
    path('create-patient', CreatePatient.as_view()),
    path('get-patient', GetPatient.as_view()),
    path('update-patient', UpdatePatient.as_view()),
    path('get-patient-neptsReq', GetPatientNeptsReq.as_view()),
    path('update-patientNepts/<userID>', UpdatePatientNEPTS.as_view()),

    # Bookings
    path('create-appointment-patient', CreateApptPatient.as_view()),
    path('get-all-appointment', GetAllAppt.as_view()),
    path('get-appointment', GetAppt.as_view()),
    path('update-appointment/<apptRefID>', UpdateAppt.as_view()),
    path('delete-appointment/<apptRefID>', DeleteAppt.as_view()),
    path('create-appointment-staff', CreateApptStaff.as_view()),

    # Optimization Routing
    path('new-schedule/<date>', NewSchedule.as_view()),
    path('get-schedule/<date>', GetSchedule.as_view()),
    path('update-schedule/<date>', UpdateSchedule.as_view()),
    path('get-schedule-update', GetScheduleUpdate.as_view()),
]