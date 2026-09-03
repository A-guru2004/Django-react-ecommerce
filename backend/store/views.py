from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from django.utils.text import slugify
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .permissions import IsAdminOrReadOnly


class StandardResultsPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

    def perform_create(self, serializer):
        name = serializer.validated_data.get('name')
        slug = serializer.validated_data.get('slug') or slugify(name)
        serializer.save(slug=slug)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'

    def perform_update(self, serializer):
        name = serializer.validated_data.get('name', serializer.instance.name)
        slug = serializer.validated_data.get('slug') or slugify(name)
        serializer.save(slug=slug)


import uuid

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = StandardResultsPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.select_related('category').all()

        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_available=True)

        category_id = self.request.query_params.get('category')
        category_slug = self.request.query_params.get('category_slug')

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        elif category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        return queryset

    def perform_create(self, serializer):
        name = serializer.validated_data.get('name')
        base_slug = slugify(name)
        # Ensure slug is unique
        slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
        serializer.save(slug=slug)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'id'

    def perform_update(self, serializer):
        name = serializer.validated_data.get('name', serializer.instance.name)
        slug = serializer.validated_data.get('slug') or slugify(name)
        serializer.save(slug=slug)


from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response(
                {"error": "product_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, id=product_id, is_available=True)

        if product.stock < quantity:
            return Response(
                {"error": f"Only {product.stock} items in stock."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, product=product
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if product.stock < new_quantity:
                return Response(
                    {"error": f"Only {product.stock} items in stock."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            cart_item.quantity = new_quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        quantity = int(request.data.get('quantity', 1))
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        if quantity <= 0:
            cart_item.delete()
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if cart_item.product.stock < quantity:
            return Response(
                {"error": f"Only {cart_item.product.stock} items in stock."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)