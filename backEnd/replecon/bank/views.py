from django.shortcuts import render
from .models import Bank, TransactionIntrestRate
from .serializers import BankSerializer, TransactionIntrestRateSerializer
from rest_framework import viewsets, generics, mixins, viewsets

from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, APIView
# Create your views here.

class BankList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

class TransactionIntrestRateList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = TransactionIntrestRate.objects.all()
    serializer_class = TransactionIntrestRateSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)