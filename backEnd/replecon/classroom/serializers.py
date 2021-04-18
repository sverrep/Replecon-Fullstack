from rest_framework import serializers
from .models import Classroom

class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['class_name', 'teacher_id', 'class_code']