from django.urls import path, include
from .views import BankList, TransactionIntrestRateList




urlpatterns = [
    path('banks/', BankList.as_view()),
    path('transactionintrestrates/', TransactionIntrestRateList.as_view()),
]