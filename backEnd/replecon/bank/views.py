from django.shortcuts import render
from .models import Bank, TransactionIntrestRate
from .serializers import BankSerializer, TransactionIntrestRateSerializer
from rest_framework import viewsets, generics, mixins, viewsets
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, APIView
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
    queryset = TransactionIntrestRate.objects.all()
    serializer_class = TransactionIntrestRateSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)