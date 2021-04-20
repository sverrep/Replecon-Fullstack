from django.urls import path, include
from .views import CreateTransaction, TransactionDetails, ListTransactionsByID


urlpatterns = [
    path('transactions/', CreateTransaction.as_view()),
    path('transactions/<int:id>', TransactionDetails.as_view()),
    path('transactions/getAllStudentTransactions/', ListTransactionsByID.as_view()),
]