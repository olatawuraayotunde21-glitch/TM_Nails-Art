from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('about/', views.about, name='about'),
    path('services/', views.services, name='services'),
    path('gallery/', views.gallery, name='gallery'),
    path('booking/', views.booking, name='booking'),
    path('contact/', views.contact, name='contact'),
    path('pricing/', views.pricing, name='pricing'),
]