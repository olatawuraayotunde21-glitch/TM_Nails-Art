from django.contrib import admin
from django.utils.html import format_html
from .models import Service, Booking

# Rebrand the admin site
admin.site.site_header = "~TM_Nails Art Administration"
admin.site.site_title = "~TM_Nails Art Admin"
admin.site.index_title = "Welcome to ~TM_Nails Art Dashboard"

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'name', 'category', 'price', 'duration', 'is_available']
    list_filter = ['category', 'is_available']
    search_fields = ['name', 'description']
    list_editable = ['price', 'is_available']
    list_per_page = 20

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">',
                obj.image.url
            )
        return "No Image"
    image_preview.short_description = 'Image'

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'description')
        }),
        ('Pricing & Duration', {
            'fields': ('price', 'duration')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Availability', {
            'fields': ('is_available',)
        }),
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'service', 'preferred_date', 'preferred_time', 'status', 'created_at']
    list_filter = ['status', 'service', 'preferred_date']
    search_fields = ['name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['created_at']
    list_per_page = 20

    fieldsets = (
        ('Client Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Booking Details', {
            'fields': ('service', 'preferred_date', 'preferred_time', 'message')
        }),
        ('Status', {
            'fields': ('status', 'created_at')
        }),
    )