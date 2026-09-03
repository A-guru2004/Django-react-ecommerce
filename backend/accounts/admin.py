from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'username', 'is_staff', 'is_active', 'is_customer')
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('is_customer', 'phone_number', 'address')}),
    )


admin.site.register(User, CustomUserAdmin)