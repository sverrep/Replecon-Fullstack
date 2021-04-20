from django.contrib import admin
from .models import Bank, TransactionIntrestRate

# Register your models here.
@admin.register(Bank)
class BankModel(admin.ModelAdmin):
    list_filter = ('classroom', 'current_intrest_rate')
    list_display = ('classroom', 'current_intrest_rate')

@admin.register(TransactionIntrestRate)
class TransactionIntrestRateModel(admin.ModelAdmin):
    list_filter = ('set_intrest_rate', 'transaction_id')
    list_display = ('set_intrest_rate', 'transaction_id')