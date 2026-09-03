from rest_framework import serializers
from .models import Order, OrderItem
from store.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'price', 'quantity')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Order
        fields = (
            'id',
            'user',
            'user_email',
            'shipping_address',
            'shipping_phone',
            'total_amount',
            'status',
            'items',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'user', 'total_amount', 'status', 'created_at', 'updated_at')


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField(required=True)
    shipping_phone = serializers.CharField(max_length=15, required=True)