from django.db import models


class Service(models.Model):
    CATEGORY_CHOICES = [
        ('manicure', 'Manicure'),
        ('pedicure', 'Pedicure'),
        ('nail_art', 'Nail Art'),
        ('training', 'Training'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100, blank=True, help_text="e.g. 45 mins, 1 hour")
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₦{self.price}"

    class Meta:
        ordering = ['category', 'price']


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.ForeignKey(
        Service, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings'
    )
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.service} - {self.preferred_date}"

    class Meta:
        ordering = ['-created_at']