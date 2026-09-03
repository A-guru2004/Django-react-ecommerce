from rest_framework import serializers
from .models import Category, Product, Cart, CartItem


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'products_count', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = (
            'id',
            'category',
            'category_name',
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'image',
            'is_available',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'slug', 'created_at', 'updated_at')


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.ImageField(source='product.image', read_only=True)
    product_stock = serializers.ReadOnlyField(source='product.stock')
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            'id',
            'product',
            'product_name',
            'product_price',
            'product_image',
            'product_stock',
            'quantity',
            'subtotal',
        )

    def get_subtotal(self, obj):
        return obj.quantity * obj.product.price


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_items', 'total_price', 'updated_at')

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_total_price(self, obj):
        return sum(item.quantity * item.product.price for item in obj.items.all())