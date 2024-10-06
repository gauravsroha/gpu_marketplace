from django.contrib import admin
from .models import GPUListing

@admin.register(GPUListing)
class GPUListingAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'brand', 'model', 'seller', 'created_at']