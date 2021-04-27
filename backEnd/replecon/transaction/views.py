from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializers import TransactionSerializer
from .models import Transaction
import logging

class CreateTransaction(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    permission_classes = [AllowAny]
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)

class TransactionDetails(generics.GenericAPIView, mixins.RetrieveModelMixin):
    queryset = Transaction.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TransactionSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

class StoreTransaction(APIView):
    queryset = Transaction.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TransactionSerializer

    def post(self, request):
        logger = logging.getLogger(__name__)
        recipient = get_user_model().objects.get(username = "STORE")
        sender_id = request.user.id
        category = "Store Purchase"
        amount = request.data["amount"]
        data = { "recipient_id": recipient.id, "sender_id": sender_id, "category": category, "amount": amount }
        transaction_serializer = TransactionSerializer(data = data)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
            return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
        return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BankTransaction(APIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def post(self, request):
        logger = logging.getLogger(__name__)
        bank = get_user_model().objects.get(username = "BANK")
        if(request.data["done"] == True):
            sender_id = bank.id
            category = "Bank Savings"
            amount = request.data["amount"]
            recipient_id = request.user.id
            data = { "recipient_id": recipient_id, "sender_id": sender_id, "category": category, "amount": amount}
            transaction_serializer = TransactionSerializer(data = data)
            if transaction_serializer.is_valid():
                transaction_serializer.save()
                return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            sender_id = request.user.id
            category = "Bank Savings"
            amount = request.data["amount"]
            data = { "recipient_id": bank.id, "sender_id": sender_id, "category": category, "amount": amount }
            transaction_serializer = TransactionSerializer(data = data)
            if transaction_serializer.is_valid():
                transaction_serializer.save()
                return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class TeacherPayStudents(APIView):

    def post(self, request):
        logger = logging.getLogger(__name__)
        recipient = get_user_model().objects.get(id = request.data["user_id"])
        sender_id = request.user.id
        category = "Class Payout"
        amount = request.data["amount"]
        data = { "recipient_id": recipient.id, "sender_id": sender_id, "category": category, "amount": amount }
        transaction_serializer = TransactionSerializer(data = data)
        if transaction_serializer.is_valid():
            transaction_serializer.save()
            return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
        return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListTransactionsByID(APIView):
    queryset = Transaction.objects.all()
    permission_classes = [AllowAny]
    serializer_class = TransactionSerializer

    def get(self, request):
        logger = logging.getLogger(__name__)
        all_transactions = Transaction.objects.all()
        transactions = []
        for transaction in all_transactions:
            if (transaction.sender_id == request.user.id):
                user = get_user_model().objects.get(id = transaction.recipient_id)
                tempdict = {"id": transaction.id, "name": user.first_name, "amount": transaction.amount, "symbol": "-"}
                transactions.append(tempdict)
            elif (transaction.recipient_id == request.user.id):
                amountstr = str(transaction.amount)
                if "-" in amountstr:
                    newamountstr = amountstr.replace("-", "")
                    user = get_user_model().objects.get(id = transaction.sender_id)
                    tempdict = {"id": transaction.id, "name": user.first_name, "amount": newamountstr, "symbol": "-"}
                    transactions.append(tempdict)
                else:
                    user = get_user_model().objects.get(id = transaction.sender_id)
                    tempdict = {"id": transaction.id, "name": user.first_name, "amount": transaction.amount, "symbol": "+"}
                    transactions.append(tempdict)
        transactions.reverse()
        return Response(transactions, status=status.HTTP_200_OK)
        
