from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Student, Teacher

class StudentInLine(admin.StackedInline):
    model = Student
    can_delete = False
    verbose_name_plural = 'student'

class TeacherInLine(admin.StackedInline):
    model = Teacher
    can_delete = False
    verbose_name_plural = 'teacher'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (StudentInLine, TeacherInLine)


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
