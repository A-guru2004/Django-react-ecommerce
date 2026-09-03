from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    ProductListCreateView,
    ProductDetailView,
    CartView,
    CartAddView,
    CartItemUpdateView,
)

urlpatterns = [
    # Categories
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:id>/', CategoryDetailView.as_view(), name='category_detail'),

    # Products
    path('products/', ProductListCreateView.as_view(), name='product_list_create'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product_detail'),

    # Cart
    path('cart/', CartView.as_view(), name='cart_view'),
    path('cart/add/', CartAddView.as_view(), name='cart_add'),
    path('cart/item/<int:item_id>/', CartItemUpdateView.as_view(), name='cart_item_update'),
]