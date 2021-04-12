from django.urls import path, include
from .views import ShopViewSet, ItemViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('shops', ShopViewSet, basename='shops')
router.register('items', ItemViewSet, basename='items')


urlpatterns = [
path('', include(router.urls)),

]