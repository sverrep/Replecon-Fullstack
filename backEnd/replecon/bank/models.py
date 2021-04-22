from django.db import models

# Create your models here.
class Bank(models.Model):
    classroom = models.CharField(max_length=6)
    current_intrest_rate = models.DecimalField(max_digits=6, decimal_places=2)

class TransactionIntrestRate(models.Model):
    set_intrest_rate = models.DecimalField(max_digits=6, decimal_places=2)
    transaction_id = models.IntegerField()
