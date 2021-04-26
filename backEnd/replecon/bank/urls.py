from django.urls import path, include
from .views import BankList, TransactionIntrestRateList, BankDetails




urlpatterns = [
    path('banks/', BankList.as_view()),
    path('banks/<int:id>', BankDetails.as_view()),
    path('transactionintrestrates/', TransactionIntrestRateList.as_view()),
]