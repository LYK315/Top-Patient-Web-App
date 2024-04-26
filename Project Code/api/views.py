from django.shortcuts import render
from django.contrib.auth.models import User, auth
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from .models import *
import time
from datetime import datetime
from django.utils import timezone
from .routingAPI.optiRouting import getRoutingSchedule
from .routingAPI.cleanData import cleanData

# Customize Session Token Details
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Authentication Session Token
class GetRoutes(APIView):
    def get(self, request, format=None):
        routes = [
            '/api/token',
            '/api/token/refersh'
        ]
        return Response(routes)


# Get Specific Patient Info
class GetPatient (APIView):
    def get(self, request, format=None):
        user = request.user
        patient = user.patient
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

# Get Patient NEPTS Application weaiting to Review
class GetPatientNeptsReq (APIView):
    def get(self, format=None):
        patientList = Patient.objects.filter(neptsValid=0)
        serializer = PatientNeptsReqSerializer(patientList, many=True)
        return Response(serializer.data)

# NOT USED FOR NOW
# Create Normal User
class CreateUser(APIView):
    permission_classes = [AllowAny]
    serializer_class = AddUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            fName = serializer.data.get('first_name')
            lName = serializer.data.get('last_name')

            user = User(email=email, userType=3,
                        first_name=fName, last_name=lName)
            user.set_password(password)  # this ensures password is hashed
            user.save()

            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        else:
            return Response({"Bad Request": "Data not found"}, status=status.HTTP_404_NOT_FOUND)
        

# Create New Admin
class CreateAdmin(APIView):
    permission_classes = [AllowAny]
    serializer_class = AddUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            fName = serializer.data.get('first_name')
            lName = serializer.data.get('last_name')

            user = User(email=email, userType=0,
                        first_name=fName, last_name=lName)
            user.set_password(password)  # this ensures password is hashed
            user.save()

            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        else:
            return Response({"Bad Request": "Data not found"}, status=status.HTTP_404_NOT_FOUND)

# Create New Patient
class CreatePatient(APIView):
    permission_classes = [AllowAny]
    serializer_class = AddPatientSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            fName = serializer.data.get('first_name')
            lName = serializer.data.get('last_name')
            nhsNum = serializer.data.get('nhsNumber')
            gender = serializer.data.get('gender')
            dob = serializer.data.get('birthDate')
            disability = serializer.data.get('disability')
            contact = serializer.data.get('contact')
            currentCondition = serializer.data.get('currentCondition')

            # Create User first
            user = User(email=email, userType=3,
                        first_name=fName, last_name=lName)
            user.set_password(password)  # this ensures password is hashed
            user.save()

            # Then Create Patient with User as foreign key
            patient = Patient(user=user, nhsNumber=nhsNum, gender=gender,
                              birthDate=dob, disability=disability, contact=contact, currentCondition=currentCondition)
            patient.save()

            return Response(PatientSerializer(patient).data, status=status.HTTP_200_OK)
        else:
            return Response({"Bad Request": "Patient Data not found"}, status=status.HTTP_404_NOT_FOUND)

# Update Patient Data - Contact
class UpdatePatient (APIView):
    serializer_class = UpdatePatientSerializer

    def put(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            contact = serializer.data.get('contact')

            user = request.user
            patient = user.patient
            patient.contact = contact
            patient.save(update_fields=['contact'])
            return Response(PatientSerializer(patient).data, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Patient update data not found'}, status=status.HTTP_200_OK)

# Update Patient Data - NEPTS Eligibility
class UpdatePatientNEPTS (APIView):
    serializer_class = UpdatePatientNepts

    def put(self, request, userID, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            neptsEligibility = serializer.data.get('neptsValid')

            user = userID
            patient = Patient.objects.get(user=user)
            patient.neptsValid = neptsEligibility
            patient.save(update_fields=['neptsValid'])
            return Response(PatientSerializer(patient).data, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Patient update data not found'}, status=status.HTTP_200_OK)

# Create New Appointment (nepts booking) PATIENT ADD
class CreateApptPatient(APIView):
    serializer_class = AddApptPatientSerializer

    def post(self, request, format=None):
        # Get Current Logged in User
        patientID = request.user.patient

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            date = serializer.data.get('apptDate')
            time = serializer.data.get('apptTime')
            endTime = serializer.data.get('apptEndTime')
            pickUp = serializer.data.get('addrPickUp')
            apptAddr = serializer.data.get('addrAppt')
            gp = serializer.data.get('gpName')
            disability = serializer.data.get('disability')
            escort = serializer.data.get('escort')
            notes = serializer.data.get('notes')
            specialReq = serializer.data.get('specialReq')

            appt = Appointment(apptDate=date, apptTime=time, apptEndTime=endTime, addrPickUp=pickUp,
                               addrAppt=apptAddr, gpName=gp, disability=disability, escort=escort, notes=notes, specialReq=specialReq)
            appt.save()

            patientAppt = AppointmentPatient(patient=patientID, apptID = appt)
            patientAppt.save()

            return Response(ApptSerializer(appt).data, status=status.HTTP_200_OK)
        else:
            return Response({"Bad Request": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

# Get ALL Patient Appointments (nepts booking)
class GetAllAppt (APIView):
    def get(self, request, format=None):
        apptData = []

        appts = Appointment.objects.all().order_by('apptDate')

        timestamp_curr = time.time()
        for appt in appts:
            date_object = datetime.strptime(str(appt.apptDate), "%Y-%m-%d")
            timestamp_appt = date_object.timestamp()
            timestamp = timestamp_appt - timestamp_curr
            if (timestamp > -86400) and (timestamp < 432000): # Within 24 hours and 5 days from current time
                apptData.append(appt)
        
        serializer = ApptSerializer(apptData, many=True)
        return Response(serializer.data)

# Get Patient Appointments (nepts booking)
class GetAppt (APIView):
    def get(self, request, format=None):
        user = request.user
        patient = user.patient
        apptID = AppointmentPatient.objects.filter(patient=patient).only('apptID_id')
        
        ids = []
        for id in apptID:
            ids.append(id.apptID.id)
        appt = Appointment.objects.filter(id__in=ids).order_by('apptDate')

        serializer = ApptSerializer(appt, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Delete Patient Appointments (nepts booking)
class DeleteAppt (APIView):
    def delete(self, request, apptRefID, format=None):
        refID = apptRefID
        if refID != None:
            appt = Appointment.objects.get(refID=refID)
            appt.delete()
            return Response({'Deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Appt Ref ID not found'})

# Update Appointment Data (nepts booking)
class UpdateAppt (APIView):
    serializer_class = UpdateApptSerializer

    def put(self, request, apptRefID, format=None):
        refID = apptRefID
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid() and refID != None:
            date = serializer.data.get('apptDate')
            time = serializer.data.get('apptTime')
            endTime = serializer.data.get('apptEndTime')
            pickUp = serializer.data.get('addrPickUp')
            apptAddr = serializer.data.get('addrAppt')
            gp = serializer.data.get('gpName')
            disability = serializer.data.get('disability')
            escort = serializer.data.get('escort')
            notes = serializer.data.get('notes')
            specialReq = serializer.data.get('specialReq')

            appt = Appointment.objects.get(refID=refID)

            appt.apptDate = date
            appt.apptTime = time
            appt.apptEndTime = endTime
            appt.addrPickUp = pickUp
            appt.addrAppt = apptAddr
            appt.gpName = gp
            appt.disability = disability
            appt.escort = escort
            appt.notes = notes
            appt.specialReq = specialReq
    
            appt.save(update_fields=['apptDate', 'apptTime', 'apptEndTime', 'addrPickUp',
                                        'addrAppt', 'gpName', 'disability', 'escort', 'notes', 'specialReq'])
            return Response(UpdateApptSerializer(appt).data, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Booking update data not found'}, status=status.HTTP_200_OK)

# Create New Appointment (nepts booking) STAFF ADD
class CreateApptStaff(APIView):
    serializer_class = AddApptStaffSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            nhsNum = serializer.data.get('nhsNumber')
            dob = serializer.data.get('birthDate')
            name = serializer.data.get('fullName')
            gender = serializer.data.get('gender')
            contact = serializer.data.get('contact')
            email = serializer.data.get('email')
            date = serializer.data.get('apptDate')
            time = serializer.data.get('apptTime')
            endTime = serializer.data.get('apptEndTime')
            pickUp = serializer.data.get('addrPickUp')
            apptAddr = serializer.data.get('addrAppt')
            gp = serializer.data.get('gpName')
            disability = serializer.data.get('disability')
            escort = serializer.data.get('escort')
            notes = serializer.data.get('notes')
            specialReq = serializer.data.get('specialReq')

            appt = Appointment(apptDate=date, apptTime=time, apptEndTime=endTime, addrPickUp=pickUp,
                               addrAppt=apptAddr, gpName=gp, disability=disability, escort=escort, notes=notes, specialReq=specialReq)
            appt.save()

            staffAppt = AppointmentStaff(apptID = appt, nhsNumber=nhsNum, birthDate=dob, fullName=name, gender=gender, contact=contact, email=email)
            staffAppt.save()

            return Response(ApptSerializer(appt).data, status=status.HTTP_200_OK)
        else:
            return Response({"Bad Request": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        

# Generate Optimization Routing Schedule
class NewSchedule(APIView):
    def get(self, request, date, format=None):
        apptData = Appointment.objects.filter(apptDate=date)
        
        # Extract Data from database
        serializer = ApptSerializer(apptData, many=True)
        data = serializer.data
        numPatient = len(data)

        # Clean the Data extracted from Database
        oriAddressList, addressList, timeWindows, deliveryNodes, escortList = cleanData(data)

        # Calculate Routing
        totalTime, schedule = getRoutingSchedule(addressList, timeWindows, deliveryNodes, escortList)

        # Store to Database
        newSchedule = RoutingSchedule(date=date, numPatient=numPatient, addressList=oriAddressList, escortList=escortList, schedule=schedule, totalTime=totalTime, updateTime=timezone.now())

        if RoutingSchedule.objects.filter(date=date).exists():
            pass
        else:
            newSchedule.save()

        return Response(RouteScheduleSerializer(newSchedule).data, status=status.HTTP_200_OK)
    

# Get Optimization Routing Schedule
class GetSchedule(APIView):
    def get(self, request, date, format=None):
        scheduleData = RoutingSchedule.objects.filter(date=date).first()

        serializer = RouteScheduleSerializer(scheduleData)

        return Response(serializer.data, status=status.HTTP_200_OK)


# Update Optimization Routing Schedule
class UpdateSchedule(APIView):
    def put(self, request, date, format=None):
        apptData = Appointment.objects.filter(apptDate=date)
        
        # Extract Data from database
        serializer = ApptSerializer(apptData, many=True)
        data = serializer.data
        numPatient = len(data)

        # Clean the Data extracted from Database
        oriAddressList, addressList, timeWindows, deliveryNodes, escortList = cleanData(data)

        # Calculate Routing
        totalTime, schedule = getRoutingSchedule(addressList, timeWindows, deliveryNodes, escortList)

        # Get Schedule reference from database
        sched = RoutingSchedule.objects.get(date=date)

        # Update Database
        sched.numPatient = numPatient
        sched.addressList = oriAddressList
        sched.escortList = escortList
        sched.schedule = schedule
        sched.totalTime = totalTime
        sched.updateTime = timezone.now()

        sched.save(update_fields=['numPatient', 'addressList', 'escortList', 'schedule','totalTime', 'updateTime'])
        
        return Response(RouteScheduleSerializer(sched).data, status=status.HTTP_200_OK)


# Get Optimization Routing Schedule Update Time
class GetScheduleUpdate(APIView):
    serializer_class = RouteScheduleUpdateSerializer

    def get(self, request, format=None):
        dates = [request.query_params[str(i)] for i in range(len(request.query_params))]

        updateTime = RoutingSchedule.objects.filter(date__in=dates).order_by('updateTime')
        serializer = RouteScheduleUpdateSerializer(updateTime, many=True)


        return Response(serializer.data, status=status.HTTP_200_OK)







