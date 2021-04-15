from django.urls import path, include
from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView, UserViewSet, StudentDetails
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    url('auth/login/$', obtain_auth_token, name = 'auth_user_login'),
    url('auth/register/$', CreateUserAPIView.as_view(), name = 'auth_user_create'),
    url('auth/logout/$', LogoutUserAPIView.as_view(), name = 'auth_user_logout'),
    path('', include(router.urls)),
    url('students/class_code/', StudentDetails.as_view()),
]