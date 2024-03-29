from django.contrib.auth import get_user_model
from .models import Shop, Item, BoughtItems
from .serializers import ShopSerializer, ItemSerializer, BoughtItemsSerializer
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import APIView
import logging
from rest_framework.permissions import DjangoModelPermissions
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from policies import checkInq

# Create your views here.

@method_decorator(csrf_protect, name="dispatch")
class ShopList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def get(self, request):
        if checkInq(request.method, "store", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "store", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ShopDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "store", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "store", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request, id):
        if checkInq(request.method, "store", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ItemList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [DjangoModelPermissions]

    def get(self, request):
        if checkInq(request.method, "item", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if checkInq(request.method, "item", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ItemDetails(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    lookup_field = 'id'

    def get(self, request, id):
        if checkInq(request.method, "item", request.user.groups.get().name) == True:
            return self.retrieve(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        if checkInq(request.method, "item", request.user.groups.get().name) == True:
            return self.update(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, id):
        if checkInq(request.method, "item", request.user.groups.get().name) == True:
            return self.destroy(request, id=id)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ListBoughtItems(APIView):

    def get(self, request):
        if checkInq(request.method, "boughtitem", request.user.groups.get().name) == True:
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
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def post(self, request):
        if checkInq(request.method, "boughtitem", request.user.groups.get().name) == True:
            logger = logging.getLogger(__name__)
            user_id = request.user.id
            data = {"item_id": request.data["item_id"], "user_id": user_id}
            bought_item_serializer = BoughtItemsSerializer(data = data)
            if bought_item_serializer.is_valid():
                bought_item_serializer.save()
                return Response(bought_item_serializer.data, status=status.HTTP_201_CREATED)
            return Response(bought_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_protect, name="dispatch")
class ListAllBoughtItems(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = BoughtItems.objects.all()
    serializer_class = BoughtItemsSerializer

    def get(self, request):
        if checkInq(request.method, "boughtitem", request.user.groups.get().name) == True:
            return self.list(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        if checkInq(request.method, "allboughtitem", request.user.groups.get().name) == True:
            return self.create(request)
        return Response(status=status.HTTP_401_UNAUTHORIZED)