from django.db import models

# Create your models here.

class Shop(models.Model):
    shop_name = models.CharField(max_length=100)
    classroom = models.IntegerField()


class Item(models.Model):
    item_name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    shop = models.IntegerField()