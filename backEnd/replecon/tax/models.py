from django.db import models

# Create your models here.

class Tax(models.Model):
    class_code = models.CharField(max_length=6)
    sales_tax = models.DecimalField(max_digits=5, decimal_places=2)
    percentage_tax = models.DecimalField(max_digits=5, decimal_places=2)
    flat_tax = models.DecimalField(max_digits=6, decimal_places=2)

class ProgressiveBracket(models.Model):
    tax_id = models.IntegerField()
    lower_bracket = models.DecimalField(max_digits=5, decimal_places=2)
    higher_bracket = models.DecimalField(max_digits=5, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

class RegressiveBracket(models.Model):
    tax_id = models.IntegerField()
    lower_bracket = models.DecimalField(max_digits=5, decimal_places=2)
    higher_bracket = models.DecimalField(max_digits=5, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)