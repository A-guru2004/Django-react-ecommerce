from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    ProfileView,
    AdminUserListView,
    AdminDashboardStatsView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    # Admin routes
    path('admin/users/', AdminUserListView.as_view(), name='admin_users_list'),
    path('admin/dashboard-stats/', AdminDashboardStatsView.as_view(), name='admin_dashboard_stats'),
]