from django.urls import path, include
from .views import BankList, TransactionIntrestRateList, BankDetails, TransactionIntrestRatePayoutDate, TransactionInterestRates




urlpatterns = [
    path('banks/', BankList.as_view()),
    path('banks/<int:id>', BankDetails.as_view()),
    path('transactioninterestrates/', TransactionIntrestRateList.as_view()),
    path('transactioninterestrates/<int:transaction_id>', TransactionInterestRates.as_view()),
    path('transactioninterestrates/payoutdate/<int:id>', TransactionIntrestRatePayoutDate.as_view()),
]