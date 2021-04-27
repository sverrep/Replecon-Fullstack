from django.contrib import admin
from .models import Tax, ProgressiveBracket, RegressiveBracket
# Register your models here.

@admin.register(Tax)
class Tax(admin.ModelAdmin):
    list_filter = ('class_code', 'sales_tax')
    list_display = ('class_code', 'sales_tax')

@admin.register(ProgressiveBracket)
class ProgressiveBracket(admin.ModelAdmin):
    list_filter = ('tax_id', 'percentage')
    list_display = ('tax_id', 'percentage')

@admin.register(RegressiveBracket)
class RegressiveBracket(admin.ModelAdmin):
    list_filter = ('tax_id', 'percentage')
    list_display = ('tax_id', 'percentage')