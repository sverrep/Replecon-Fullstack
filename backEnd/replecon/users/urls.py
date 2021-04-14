from django.conf.urls import url
from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView

urlpatterns = [
    url('auth/login/$', obtain_auth_token, name = 'auth_user_login'),
    url('auth/register/$', CreateUserAPIView.as_view(), name = 'auth_user_create'),
    url('auth/logout/$', LogoutUserAPIView.as_view(), name = 'auth_user_logout')
]