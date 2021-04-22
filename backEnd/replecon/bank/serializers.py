from rest_framework import serializers
from .models import Bank, TransactionIntrestRate

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'classroom', 'current_intrest_rate']


class TransactionIntrestRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionIntrestRate
        fields = ['id', 'set_intrest_rate', 'transaction_id']