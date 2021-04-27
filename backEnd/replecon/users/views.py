from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework import viewsets, generics, mixins, viewsets, status
from users.serializers import CreateUserSerializer, CreateStudentSerializer, CreateTeacherSerializer
from .models import Student, Teacher
from decimal import Decimal
import logging

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

class UserDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

class CreateTeacherAPIView(CreateAPIView):
    def post(self, request):
        logger = logging.getLogger(__name__)
        teacher = get_user_model().objects.get(id = request.user.id)
        data = {"user": teacher.id, "last_name": request.data["last_name"]}
        serializer = CreateTeacherSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format = None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class CurrentStudent(APIView):
    def get(self, request):
        logger = logging.getLogger(__name__)
        user = get_user_model().objects.get(id = request.user.id)
        users = get_user_model().objects.all()
        teachers = Teacher.objects.all()
        students = Student.objects.all()
        user_serializer = CreateUserSerializer(user)
        for teacher in teachers:
            if user.id == teacher.user_id:
                teacher_serializer = CreateTeacherSerializer(teacher)
                data = {'user': user_serializer.data, 'teacher': teacher_serializer.data}
                return Response(data, status=status.HTTP_200_OK)
        return Response(user_serializer.data, status=status.HTTP_200_OK)

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
        user = get_user_model().objects.get(username = "STORE")
        return Response(user.id, status=status.HTTP_200_OK)

class BankStudent(APIView):
    def get(self, request):
        user = get_user_model().objects.get(username = "BANK")
        return Response(user.id, status=status.HTTP_200_OK)
        

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer

    def get(self, request, format = None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    
class StudentClassCode(APIView):
    
    def get(self, request):
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


class StudentBalance(APIView):
    
    def get(self, request):
        student = Student.objects.get(user_id = request.user.id)
        return Response(student.balance, status=status.HTTP_200_OK)
    
    def put(self, request):
        logger = logging.getLogger(__name__)
        isStudent = False
        students = Student.objects.all()
        for student in students:
            if(student.user.id == request.user.id):
                isStudent = True
        if isStudent:
            sender = Student.objects.get(user_id = request.user.id)
            data = request.data
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
            logger.error(sender_serializer.errors)
            return Response(sender_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data
            recipient = Student.objects.get(user_id = data["user_id"])
            amount = data["amount"]
            recipient_data = {"user": recipient.user.id, "balance": (recipient.balance + Decimal(amount)), "class_code": recipient.class_code}
            recipient_serializer = CreateStudentSerializer(recipient, recipient_data)
            if recipient_serializer.is_valid():
                recipient_serializer.save()
                return Response(recipient_serializer.data, status=status.HTTP_201_CREATED)
            logger.error(sender_serializer.errors)
            return Response(sender_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentList(APIView):
    
    def get(self, request):
        logger = logging.getLogger(__name__)
        students = Student.objects.all()
        data = []
        for student in students:
            tempdict = {"id": student.user.id, "name": student.user.first_name, "class_code": student.class_code, "balance": student.balance}
            data.append(tempdict)
        sorted_list = sorted(data, key=lambda k: k['name']) 
        return Response(sorted_list, status=status.HTTP_200_OK)