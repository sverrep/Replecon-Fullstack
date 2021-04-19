from django.db import models

# Create your models here.

class Transaction(models.Model):
    recipient_id = models.IntegerField()
    sender_id = models.IntegerField()
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=5, decimal_places=2)