from django.contrib.auth import get_user_model
from django.shortcuts import render
from .models import Shop, Item, BoughtItems
from .serializers import ShopSerializer, ItemSerializer, BoughtItemsSerializer
from rest_framework import viewsets, generics, mixins, viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, APIView
import logging
from rest_framework.permissions import AllowAny, DjangoModelPermissions

# Create your views here.


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
    permission_classes = [DjangoModelPermissions]

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

class ListBoughtItems(APIView):

    def get(self, request):
        logger = logging.getLogger(__name__)
        user = get_user_model().objects.get(id = request.user.id)
        bought_items = BoughtItems.objects.all()
        user_items = []
        for item in bought_items:
            if item.user_id == user.id:
                tempitem = Item.objects.get(id = item.item_id)
                tempdict = {"id": item.id, "item_name": tempitem.item_name, "item_description": tempitem.description}
                user_items.append(tempdict)
        return Response(user_items, status=status.HTTP_200_OK)
    
    def post(self, request):
        logger = logging.getLogger(__name__)
        user_id = request.user.id
        data = {"item_id": request.data["item_id"], "user_id": user_id}
        bought_item_serializer = BoughtItemsSerializer(data = data)
        if bought_item_serializer.is_valid():
            bought_item_serializer.save()
            return Response(bought_item_serializer.data, status=status.HTTP_201_CREATED)
        return Response(bought_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListAllBoughtItems(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = BoughtItems.objects.all()
    serializer_class = BoughtItemsSerializer

    def get(self, request):
        return self.list(request)

    def post(self, request):
        return self.create(request)