from django.contrib.auth import get_user_model
from rest_framework import viewsets, generics, mixins, status
from rest_framework.permissions import AllowAny
from .serializers import TransactionSerializer
from .models import Transaction

class CreateTransaction(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    permission_classes = [AllowAny]
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)