from django.contrib import admin
from .models import Bank, TransactionInterestRate

# Register your models here.
@admin.register(Bank)
class BankModel(admin.ModelAdmin):
    list_filter = ('class_code', 'interest_rate', 'payout_rate')
    list_display = ('class_code', 'interest_rate', 'payout_rate')

@admin.register(TransactionInterestRate)
class TransactionInterestRateModel(admin.ModelAdmin):
    list_filter = ('set_interest_rate', 'transaction_id', 'active', 'end_date')
    list_display = ('set_interest_rate', 'transaction_id', 'active', 'end_date')