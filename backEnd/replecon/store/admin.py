from django.contrib import admin
from .models import Shop, Item, BoughtItems
# Register your models here.

@admin.register(Shop)
class ShopModel(admin.ModelAdmin):
    list_filter = ('shop_name', 'classroom')
    list_display = ('shop_name', 'classroom')

@admin.register(Item)
class ItemModel(admin.ModelAdmin):
    list_filter = ('item_name', 'description')
    list_display = ('item_name', 'description')

@admin.register(BoughtItems)
class BoughtItemsModel(admin.ModelAdmin):
    list_filter = ('item_id', 'user_id')
    list_display = ('item_id', 'user_id')
