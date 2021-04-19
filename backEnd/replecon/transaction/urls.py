from django.urls import path, include
from .views import CreateTransaction


urlpatterns = [
    path('transactions/', CreateTransaction.as_view()),
]