from django.db import models

# Create your models here.
class Bank(models.Model):
    classroom = models.CharField(max_length=6)
    interest_rate = models.DecimalField(max_digits=6, decimal_places=2)
    payout_rate = models.IntegerField()

class TransactionInterestRate(models.Model):
    set_interest_rate = models.DecimalField(max_digits=6, decimal_places=2)
    transaction_id = models.IntegerField()
    active = models.BooleanField()
    end_date = models.DateField()