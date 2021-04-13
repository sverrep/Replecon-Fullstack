from django.urls import path, include
from .views import ShopDetails, ShopList, ItemDetails, ItemList, ItemFromShop




urlpatterns = [
    path('shops/', ShopList.as_view()),
    path('shops/<int:id>', ShopDetails.as_view()),
    path('items/', ItemList.as_view()),
    path('items/<int:id>', ItemDetails.as_view()),
    path('itemfromshop/<int:shop>', ItemFromShop.as_view())
]