from django.contrib.auth import get_user_model
from django.db.models.query import QuerySet
from rest_framework import viewsets, generics, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.views import APIView
from .serializers import TransactionSerializer
from .models import Transaction
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
import logging
from policies import checkInq

@method_decorator(csrf_protect, name="dispatch")
class CreateTransaction(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get(self, request):
        if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_protect, name="dispatch")
class TransactionDetails(generics.GenericAPIView, mixins.RetrieveModelMixin):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, id):
        if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
@method_decorator(csrf_protect, name="dispatch")
class StoreTransaction(APIView):
    queryset = Transaction.objects.all()
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
            if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
                return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_protect, name="dispatch")
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
                if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
                    return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            sender_id = request.user.id
            category = "Bank Savings"
            amount = request.data["amount"]
            data = { "recipient_id": bank.id, "sender_id": sender_id, "category": category, "amount": amount }
            transaction_serializer = TransactionSerializer(data = data)
            if transaction_serializer.is_valid():
                transaction_serializer.save()
                if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
                    return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_protect, name="dispatch")
class TeacherPayStudents(APIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [DjangoModelPermissions]

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
            if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
                return Response(transaction_serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListTransactionsByID(APIView):
    queryset = Transaction.objects.all()
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
        if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
            return Response(transactions, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class GetTransactionsByID(APIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    lookup_field = 'id'

    def get(self, request, id):
        logger = logging.getLogger(__name__)
        all_transactions = Transaction.objects.all()
        transactions = []
        for transaction in all_transactions:
            if (transaction.sender_id == id):
                user = get_user_model().objects.get(id = transaction.recipient_id)
                tempdict = {"id": transaction.id, "name": user.first_name, "amount": transaction.amount, "symbol": "-"}
                transactions.append(tempdict)
            elif (transaction.recipient_id == id):
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
        if checkInq(request.method, "transactions", request.user.groups.get().name) == True:
            return Response(transactions, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
