from django.shortcuts import render
from .models import Bank, TransactionInterestRate
from .serializers import BankSerializer, TransactionInterestRateSerializer
from rest_framework import viewsets, generics, mixins, status
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, APIView
import datetime
import logging
# Create your views here.

class BankList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)
        
class BankDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)

class TransactionIntrestRateList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = TransactionInterestRate.objects.all()
    serializer_class = TransactionInterestRateSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        logger = logging.getLogger(__name__)
        banks = Bank.objects.all()
        for bank in banks:
            if (bank.classroom == request.data["class_code"]):
                set_interest_rate = bank.interest_rate
                logger.error(request.data)
                transaction_id = request.data["transaction_id"]
                active = True
                end_date = datetime.date.today() + datetime.timedelta(bank.payout_rate * 7)
                data = {"set_interest_rate": set_interest_rate, "transaction_id": transaction_id, "active": active, "end_date": end_date}
                serializer = TransactionInterestRateSerializer(data = data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        logger = logging.getLogger(__name__)
        logger.error(request.data["transaction_id"])
        transaction = TransactionInterestRate.objects.get(transaction_id = request.data["transaction_id"])
        active = request.data["active"]
        data = {"set_interest_rate": transaction.set_interest_rate, "transaction_id": transaction.transaction_id, "active": active, "end_date": transaction.end_date}
        serializer = TransactionInterestRateSerializer(transaction, data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionIntrestRatePayoutDate(APIView):
    queryset = TransactionInterestRate.objects.all()
    serializer_class = TransactionInterestRateSerializer

    lookup_field = 'id'
    def get(self, request, id=id):
        logger = logging.getLogger(__name__)
        transaction = TransactionInterestRate.objects.get(transaction_id = id)
        current_date = datetime.date.today()
        payout_date = transaction.end_date - current_date
        return Response(payout_date, status=status.HTTP_200_OK)