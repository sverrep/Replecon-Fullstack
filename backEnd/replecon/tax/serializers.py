from rest_framework import serializers
from .models import Tax, ProgressiveBracket, RegressiveBracket

class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = ['id', 'class_code', 'sales_tax', 'percentage_tax', 'flat_tax']

class ProgressiveBracketSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressiveBracket
        fields = ['id', 'tax_id', 'lower_bracket', 'higher_bracket', 'percentage']

class RegressiveBracketSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegressiveBracket
        fields = ['id', 'tax_id', 'lower_bracket', 'higher_bracket', 'percentage']
