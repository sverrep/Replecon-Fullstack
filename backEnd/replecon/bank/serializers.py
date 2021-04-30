from rest_framework import serializers
from .models import Bank, TransactionInterestRate

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'class_code', 'interest_rate', 'payout_rate']


class TransactionInterestRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionInterestRate
        fields = ['id', 'set_interest_rate', 'transaction_id', 'active', 'end_date']