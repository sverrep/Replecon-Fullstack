from .models import Bank, TransactionInterestRate
from .serializers import BankSerializer, TransactionInterestRateSerializer
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework.permissions import DjangoModelPermissions
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
import datetime
import logging
from policies import checkInq
# Create your views here.

@method_decorator(csrf_protect, name="dispatch")
class BankList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    permission_classes = [DjangoModelPermissions]

    def get(self, request):
        if checkInq(request.method, "bank", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "bank", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class BankDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    permission_classes = [DjangoModelPermissions]

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "bank", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "bank", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        if checkInq(request.method, "bank", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class TransactionIntrestRateList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = TransactionInterestRate.objects.all()
    serializer_class = TransactionInterestRateSerializer

    def get(self, request):
        if checkInq(request.method, "transactionintrest", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        logger = logging.getLogger(__name__)
        banks = Bank.objects.all()
        for bank in banks:
            if (bank.class_code == request.data["class_code"]):
                set_interest_rate = bank.interest_rate
                logger.error(request.data)
                transaction_id = request.data["transaction_id"]
                active = True
                end_date = datetime.date.today() + datetime.timedelta(bank.payout_rate * 7)
                data = {"set_interest_rate": set_interest_rate, "transaction_id": transaction_id, "active": active, "end_date": end_date}
                serializer = TransactionInterestRateSerializer(data = data)
                if serializer.is_valid():
                    serializer.save()
                    if checkInq(request.method, "transactionintrest", request.user.groups.get().name) == True:
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
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
            if checkInq(request.method, "transactionintrest", request.user.groups.get().name) == True:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_401_UNAUTHORIZED)
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
        if checkInq(request.method, "transactionintrest", request.user.groups.get().name) == True:
            return Response(payout_date, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class TransactionInterestRates(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = TransactionInterestRate.objects.all()
    serializer_class = TransactionInterestRateSerializer

    lookup_field = 'transaction_id'

    def get(self, request, transaction_id):
        if checkInq(request.method, "transactionintrestpayout", request.user.groups.get().name) == True:
            return self.retrieve(request, transaction_id=transaction_id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, transaction_id):
        if checkInq(request.method, "transactionintrestpayout", request.user.groups.get().name) == True:
            return self.destroy(request, transaction_id=transaction_id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)