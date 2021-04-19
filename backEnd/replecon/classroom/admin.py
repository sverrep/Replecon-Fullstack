from django.contrib import admin
from .models import Classroom

# Register your models here.

@admin.register(Classroom)
class ClassroomModel(admin.ModelAdmin):
    list_filter = ('class_name', 'teacher_id')
    list_display = ('class_name', 'teacher_id')
