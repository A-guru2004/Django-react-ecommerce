from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from store.models import Cart, CartItem


class OrderListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items__product')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_object_or_404(Cart, user=request.user)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty. Cannot place an order."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Atomic transaction: validate stock, deduct stock, create order, flush cart
        with transaction.atomic():
            for item in cart_items:
                if item.quantity > item.product.stock:
                    return Response(
                        {"error": f"Insufficient stock for {item.product.name}."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            total_amount = sum(item.quantity * item.product.price for item in cart_items)

            order = Order.objects.create(
                user=request.user,
                shipping_address=serializer.validated_data['shipping_address'],
                shipping_phone=serializer.validated_data['shipping_phone'],
                total_amount=total_amount,
                status='Pending',
            )

            order_items_to_create = []
            for item in cart_items:
                # Deduct inventory stock
                item.product.stock -= item.quantity
                if item.product.stock == 0:
                    item.product.is_available = False
                item.product.save()

                order_items_to_create.append(
                    OrderItem(
                        order=order,
                        product=item.product,
                        price=item.product.price,
                        quantity=item.quantity,
                    )
                )

            OrderItem.objects.bulk_create(order_items_to_create)

            # Clear user's cart
            cart_items.delete()

        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

class AdminOrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = OrderSerializer
    queryset = Order.objects.all().prefetch_related('items__product').select_related('user').order_by('-created_at')


class AdminOrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Choose from: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)