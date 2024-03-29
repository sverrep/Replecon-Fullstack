from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import viewsets, generics, mixins, status
from django.contrib.auth.models import Group
from users.serializers import CreateUserSerializer, CreateStudentSerializer, CreateTeacherSerializer
from django.middleware.csrf import get_token
from .models import Student, Teacher
from decimal import Decimal
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
import logging
from policies import checkInq

class CreateUserAPIView(CreateAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = CreateUserSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token = Token.objects.create(user=serializer.instance)
        token_data = {"token": token.key}
        return Response(
            {**serializer.data, **token_data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

@method_decorator(csrf_protect, name="dispatch")
class UserDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer

    lookup_field = 'id'
    
    def get(self, request, id):
        if checkInq(request.method, "userid", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, id):
        if checkInq(request.method, "userid", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class TeacherList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Teacher.objects.all()
    serializer_class = CreateTeacherSerializer

    def get(self, request):
        if checkInq(request.method, "teacherlist", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "createteachers", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class CreateTeacherAPIView(CreateAPIView):
    def post(self, request):
        logger = logging.getLogger(__name__)
        teacher = get_user_model().objects.get(id = request.user.id)
        data = {"user": teacher.id, "last_name": request.data["last_name"]}
        serializer = CreateTeacherSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            teachers = Group.objects.get(name='Teacher')
            teachers.user_set.add(teacher.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateStudentAPIView(CreateAPIView):
    def post(self, request):
        student = get_user_model().objects.get(id = request.user.id)
        data = {"user": student.id, "class_code": request.data["class_code"]}
        serializer = CreateStudentSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            students = Group.objects.get(name='Student')
            students.user_set.add(student.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format = None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class CurrentStudent(APIView):
    def get(self, request):
        if checkInq(request.method, "currentstudent", request.user.groups.get().name) == True:
            logger = logging.getLogger(__name__)
            user = get_user_model().objects.get(id = request.user.id)
            teachers = Teacher.objects.all()
            user_serializer = CreateUserSerializer(user)
            for teacher in teachers:
                if user.id == teacher.user_id:
                    teacher_serializer = CreateTeacherSerializer(teacher)
                    data = {'user': user_serializer.data, 'teacher': teacher_serializer.data}
                    return Response(data, status=status.HTTP_200_OK)
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class IsUserTeacher(APIView):
    def get(self, request):
        user = get_user_model().objects.get(id = request.user.id)
        teachers = Teacher.objects.all()
        for teacher in teachers:
            if user.id == teacher.user_id:
                return Response(True, status=status.HTTP_200_OK)
        return Response(False, status=status.HTTP_200_OK)
        
class StoreStudent(APIView):
    def get(self, request):
        if checkInq(request.method, "storeuser", request.user.groups.get().name) == True:
            user = get_user_model().objects.get(username = "STORE")
            return Response(user.id, status=status.HTTP_200_OK)

class BankStudent(APIView):
    def get(self, request):
        if checkInq(request.method, "bankuser", request.user.groups.get().name) == True:
            user = get_user_model().objects.get(username = "BANK")
            return Response(user.id, status=status.HTTP_200_OK)
        

class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer

    def get(self, request, format = None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    
class StudentClassCode(APIView):
    
    def get(self, request):
        if checkInq(request.method, "studentclasscode", request.user.groups.get().name) == True:
            queryset = Student.objects.all()
            loggedin_student = Student.objects.get(user_id = request.user.id)
            class_code = loggedin_student.class_code
            classroom_students = []
            for student in queryset:
                if (student.class_code == class_code):
                    tempdict = {"id": student.user.id, "name": student.user.first_name, "class_code": class_code}
                    classroom_students.append(tempdict)
            sorted_list = sorted(classroom_students, key=lambda k: k['name']) 
            return Response(sorted_list, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class StudentBalance(APIView):
    
    def get(self, request):
        if checkInq(request.method, "balance", request.user.groups.get().name) == True:
            student = Student.objects.get(user_id = request.user.id)
            return Response(student.balance, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def put(self, request):
        if checkInq(request.method, "balance", request.user.groups.get().name) == True:
            logger = logging.getLogger(__name__)
            isStudent = False
            logger.error(request.data)
            students = Student.objects.all()
            for student in students:
                if(student.user.id == request.user.id):
                    isStudent = True
            if isStudent:
                data = request.data
                if request.data["recipient"] == True:
                    sender = Student.objects.get(user_id = data["user_id"])
                    recipient = Student.objects.get(user_id = request.user.id)
                elif request.data["recipient"] == False:
                    sender = Student.objects.get(user_id = request.user.id)
                    recipient = Student.objects.get(user_id = data["user_id"])
                amount = data["amount"]
                sender_data = {"user": sender.user.id, "balance": (sender.balance - Decimal(amount)), "class_code": sender.class_code}
                recipient_data = {"user": recipient.user.id, "balance": (recipient.balance + Decimal(amount)), "class_code": recipient.class_code}
                sender_serializer = CreateStudentSerializer(sender, sender_data)
                recipient_serializer = CreateStudentSerializer(recipient, recipient_data)
                if sender_serializer.is_valid():
                    if recipient_serializer.is_valid():
                        sender_serializer.save()
                        recipient_serializer.save()
                        return Response(status=status.HTTP_201_CREATED)
                    return Response(recipient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response(sender_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                data = request.data
                recipient = Student.objects.get(user_id = data["user_id"])
                amount = data["amount"]
                recipient_data = {"user": recipient.user.id, "balance": (recipient.balance + Decimal(amount)), "class_code": recipient.class_code}
                logger.error(recipient.balance + Decimal(amount))
                recipient_serializer = CreateStudentSerializer(recipient, recipient_data)
                if recipient_serializer.is_valid():
                    recipient_serializer.save()
                    return Response(recipient_serializer.data, status=status.HTTP_201_CREATED)
                logger.error(recipient_serializer.errors)

                return Response(recipient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class StudentList(APIView):
    
    def get(self, request):
        if checkInq(request.method, "students", request.user.groups.get().name) == True:
            logger = logging.getLogger(__name__)
            students = Student.objects.all()
            data = []
            for student in students:
                tempdict = {"id": student.user.id, "name": student.user.first_name, "class_code": student.class_code, "balance": student.balance}
                data.append(tempdict)
            sorted_list = sorted(data, key=lambda k: k['name']) 
            return Response(sorted_list, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class CreateBankStore(APIView):

    def post(self, request):
        logger = logging.getLogger(__name__)
        store_user_data = {"username": "STORE", "password": "STORE", "first_name": "STORE"}
        store_student_data = {"balance": 0, "class_code": 000000, "user": 1}
        bank_user_data = {"username": "BANK", "password": "BANK", "first_name": "BANK"}
        bank_student_data = {"balance": 1000, "class_code": 000000, "user": 2}
        store_user_serializer = CreateUserSerializer(data = store_user_data)
        store_user_serializer.is_valid(raise_exception = True)
        store_user_serializer.save()
        bank_user_serializer = CreateUserSerializer(data = bank_user_data)
        bank_user_serializer.is_valid(raise_exception = True)
        bank_user_serializer.save()
        store_serializer = CreateStudentSerializer(data = store_student_data)
        if store_serializer.is_valid():
            store_serializer.save()
        bank_serializer = CreateStudentSerializer(data = bank_student_data)
        if bank_serializer.is_valid():
            bank_serializer.save()
        return Response(status=status.HTTP_201_CREATED)

@method_decorator(ensure_csrf_cookie, name="dispatch")
class GetCSRFToken(APIView):

    def get(self, request):
        return JsonResponse({'csrfToken': get_token(request)})