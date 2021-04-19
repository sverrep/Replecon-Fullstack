from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status, viewsets
from rest_framework.views import APIView
from users.serializers import CreateUserSerializer, CreateStudentSerializer
from .models import Student
from decimal import Decimal

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

class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format = None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class CurrentStudent(APIView):
    def get(self, request):
        student = Student.objects.get(user_id = request.user.id)
        return Response(student.user_id, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer

    def get(self, request, format = None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    
class StudentClassCode(APIView):
    def put(self, request, *args, **kwargs):
        student = Student.objects.get(user_id = request.user.id)
        serializer = CreateStudentSerializer(student, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
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
    
    def put(self, request, *args, **kwargs):
        sender = Student.objects.get(user_id = request.user.id)
        data = request.data
        recipient = Student.objects.get(user_id = data["user_id"])
        amount = data["amount"]
        sender_data = {"balance": (sender.balance - Decimal(amount)), "class_code": sender.class_code}
        recipient_data = {"balance": (recipient.balance + Decimal(amount)), "class_code": recipient.class_code}
        sender_serializer = CreateStudentSerializer(sender, sender_data)
        recipient_serializer = CreateStudentSerializer(recipient, recipient_data)
        if sender_serializer.is_valid():
            if recipient_serializer.is_valid():
                sender_serializer.save()
                recipient_serializer.save()
                return Response(status=status.HTTP_201_CREATED)
            return Response(recipient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(sender_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



        
