from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Service
from .forms import BookingForm

# Create your views here.
def home(request):
    return render(request, 'tmnails/index.html')

def about(request):
    return render(request, 'tmnails/about.html')

def services(request):
    return render(request, 'tmnails/services.html')

def gallery(request):
    return render(request, 'tmnails/gallery.html')

def contact(request):
    return render(request, 'tmnails/contact.html')

def booking(request):
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your booking has been submitted successfully! We will contact you shortly.')
            return redirect('booking')
    else:
        form = BookingForm()
    
    return render(request, 'tmnails/booking.html', {'form': form})

def pricing(request):
    available_services = Service.objects.filter(is_available=True)
    manicure = available_services.filter(category='manicure')
    pedicure = available_services.filter(category='pedicure')
    nail_art = available_services.filter(category='nail_art')
    training = available_services.filter(category='training')
    other = available_services.filter(category='other')

    context = {
        'manicure': manicure,
        'pedicure': pedicure,
        'nail_art': nail_art,
        'training': training,
        'other': other,
    }
    return render(request, 'tmnails/pricing.html', context)