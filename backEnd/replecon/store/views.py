from django.shortcuts import render
from .models import Shop, Item
from .serializers import ShopSerializer, ItemSerializer
from rest_framework import viewsets, generics, mixins, viewsets

# Create your views here.
'''
class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

'''

class ShopList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def get(self, request):
        return self.list(request)
    
    def post(self, request):
        return self.create(request)

class ShopDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)
    
    def delete(self, request, id):
        return self.destroy(request, id=id)


class ItemList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)

class ItemDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    lookup_field = 'id'

    def get(self, request, id):
        return self.retrieve(request, id=id)

    def put(self, request, id):
        return self.update(request, id=id)

    def delete(self, request, id):
        return self.destroy(request, id=id)

class ItemFromShop(generics.GenericAPIView, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    lookup_field = 'shop'

    def get(self, request, shop):
        self.queryset.filter(shop=shop)
        return self.list(request)
