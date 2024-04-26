from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Session Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims in token
        token['email'] = user.email
        token['firstName'] = user.first_name
        token['userType'] = user.userType
        return token

# ---------------------------------------------------------------------------------------- #

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# Add User Serializer
class AddUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'userType', 'first_name', 'last_name']

# ---------------------------------------------------------------------------------------- #
        
# Patient Serializer
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

# Add Patient Serializer
class AddPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CombineUserPatient
        fields = ['email', 'password', 'first_name', 'last_name',
                  'nhsNumber', 'gender', 'birthDate', 'disability', 'contact', 'currentCondition']

# Update Patient Serializer
class UpdatePatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['contact']

# Update Patient NEPTS Eligibility Serializer
class UpdatePatientNepts(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['neptsValid']

# Patient NEPTS Application Serializer
class PatientNeptsReqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['user', 'nhsNumber', 'gender', 'birthDate', 'disability', 'neptsValid', 'currentCondition', 'contact']

# ---------------------------------------------------------------------------------------- #
        
# Appointment Serializer
class ApptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

# Patient Add Appointment Serializer
class AddApptPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['apptDate', 'apptTime', 'apptEndTime', 'addrPickUp',
                  'addrAppt', 'gpName', 'disability', 'escort', 'notes', 'specialReq']
        
# Update Appointment Serializer
# Might have other details to update (in futrue), so use extra serializer for update
class UpdateApptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['apptDate', 'apptTime', 'apptEndTime', 'addrPickUp',
                  'addrAppt', 'gpName', 'disability', 'escort', 'notes', 'specialReq']

# Staff Add Appointment Serializer
class AddApptStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddAppointmentStaff
        fields = ['nhsNumber', 'birthDate', 'fullName', 'gender', 'contact', 'email', 'apptDate', 'apptTime', 'apptEndTime',
                  'addrPickUp', 'addrAppt', 'gpName', 'disability', 'escort', 'notes', 'specialReq']


# ---------------------------------------------------------------------------------------- #

# Routing Schedule Serializer
class RouteScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutingSchedule
        fields = '__all__'


# Get Routing Schedule Update Time Serializer
class RouteScheduleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutingSchedule
        fields = ['updateTime']   