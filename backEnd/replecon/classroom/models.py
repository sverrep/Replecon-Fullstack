from django.db import models

# Create your models here.
class Classroom(models.Model):
    class_name = models.CharField(max_length=100)
    teacher_id = models.IntegerField()
    class_code = models.CharField(max_length=6)