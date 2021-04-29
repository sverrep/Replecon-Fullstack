from django.db import connection
from django.contrib.auth import get_user_model
from .models import Student, Teacher
from .serializers import CreateUserSerializer, CreateStudentSerializer, CreateTeacherSerializer


print("hello world")


"""store_user_data = {"username": "STORE", "password": "STORE", "first_name": "STORE"}
store_student_data = {"balance": 0, "class_code": 000000, "user_id": 80}
bank_user_data = {"username": "BANK", "password": "BANK", "first_name": "BANK"}
bank_student_data = {"balance": 1000, "class_code": 000000, "user_id": 81}
store_user_serializer = CreateUserSerializer(data = store_user_data)
serializer.is_valid(raise_exception = True)
self.perform_create(serializer)
bank_user_serializer = CreateUserSerializer(data = bank_user_data)
serializer.is_valid(raise_exception = True)
self.perform_create(serializer)
store_serializer = CreateStudentSerializer(data = store_student_data)
store_serializer.save()
bank_serializer = CreateStudentSerializer(data = bank_student_data)
bank_serializer.save()"""
