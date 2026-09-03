from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    AdminOrderListView,
    AdminOrderStatusUpdateView,
)

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order_list_create'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order_detail'),
    # Admin routes
    path('admin/all/', AdminOrderListView.as_view(), name='admin_order_list'),
    path('admin/<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin_order_status_update'),
]