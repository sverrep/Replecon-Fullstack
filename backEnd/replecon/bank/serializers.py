from rest_framework import serializers
from .models import Bank, TransactionIntrestRate

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'classroom', 'interest_rate', 'payout_rate']


class TransactionIntrestRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionIntrestRate
        fields = ['id', 'set_interest_rate', 'transaction_id']