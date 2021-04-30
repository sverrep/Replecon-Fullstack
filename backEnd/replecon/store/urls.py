from django.urls import path, include
from .views import ShopDetails, ShopList, ItemDetails, ItemList, ListBoughtItems




urlpatterns = [
    path('shops/', ShopList.as_view()),
    path('shops/<int:id>', ShopDetails.as_view()),
    path('items/', ItemList.as_view()),
    path('items/<int:id>', ItemDetails.as_view()),
    path('items/boughtitems/', ListBoughtItems.as_view()),
]