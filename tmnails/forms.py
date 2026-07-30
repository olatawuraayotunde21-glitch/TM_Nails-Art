from django import forms
from .models import Booking, Service

class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['name', 'email', 'phone', 'service', 'preferred_date', 'preferred_time', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your Full Name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Your Email Address'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Phone / WhatsApp Number'
            }),
            'service': forms.Select(attrs={
                'class': 'form-control'
            }),
            'preferred_date': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'preferred_time': forms.TimeInput(attrs={
                'class': 'form-control',
                'type': 'time'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Any special requests or questions?',
                'rows': 4
            }),
        }