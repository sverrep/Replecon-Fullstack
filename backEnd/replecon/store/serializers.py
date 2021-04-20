from rest_framework import serializers
from .models import Shop, Item, BoughtItems

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['id', 'shop_name', 'classroom']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'item_name', 'description', 'price', 'shop']

class BoughtItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoughtItems
        fields = ['item_id', 'user_id']
