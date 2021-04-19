from django.urls import path, include
from .views import ClassroomDetails, ClassroomList


urlpatterns = [
    path('classrooms/', ClassroomList.as_view()),
    path('classrooms/<int:id>', ClassroomDetails.as_view()),
]