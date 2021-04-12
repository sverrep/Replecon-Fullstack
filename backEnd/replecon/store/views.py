from django.shortcuts import render
from .models import Shop, Item
from .serializers import ShopSerializer, ItemSerializer
from rest_framework import viewsets
# Create your views here.

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer