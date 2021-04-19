from rest_framework import serializers
from .models import Classroom

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id', 'class_name', 'teacher_id', 'class_code']
        lookup_field = "class_code"