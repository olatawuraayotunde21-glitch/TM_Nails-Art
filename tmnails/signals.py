from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Booking


@receiver(pre_save, sender=Booking)
def store_old_status(sender, instance, **kwargs):
    """Remember the previous status before this save happens."""
    if instance.pk:
        try:
            instance._old_status = Booking.objects.get(pk=instance.pk).status
        except Booking.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Booking)
def notify_on_booking_change(sender, instance, created, **kwargs):
    service_name = instance.service.name if instance.service else "Not specified"

    if created:
        # --- New booking: notify YOU ---
        send_mail(
            subject=f"New Booking: {instance.name} — {service_name}",
            message=(
                f"Name: {instance.name}\n"
                f"Email: {instance.email}\n"
                f"Phone: {instance.phone}\n"
                f"Service: {service_name}\n"
                f"Date: {instance.preferred_date}\n"
                f"Time: {instance.preferred_time}\n"
                f"Message: {instance.message or 'None'}\n"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.SALON_OWNER_EMAIL],
            fail_silently=True,
        )

        # --- New booking: notify the CUSTOMER it was received ---
        send_mail(
            subject="We've received your ~TM_Nails Art booking request",
            message=(
                f"Hi {instance.name},\n\n"
                f"Thanks for booking with ~TM_Nails Art! Here's what you submitted:\n\n"
                f"Service: {service_name}\n"
                f"Date: {instance.preferred_date}\n"
                f"Time: {instance.preferred_time}\n\n"
                f"Your booking is currently PENDING. We'll email you again once it's confirmed.\n\n"
                f"— ~TM_Nails Art"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
            fail_silently=True,
        )

    else:
        # --- Existing booking updated: check if status actually changed ---
        old_status = getattr(instance, '_old_status', None)

        if old_status and old_status != instance.status and instance.status in ('confirmed', 'cancelled'):

            if instance.status == 'confirmed':
                subject = "Your ~TM_Nails Art appointment is confirmed!"
                body = (
                    f"Hi {instance.name},\n\n"
                    f"Good news — your appointment has been CONFIRMED.\n\n"
                    f"Service: {service_name}\n"
                    f"Date: {instance.preferred_date}\n"
                    f"Time: {instance.preferred_time}\n\n"
                    f"See you soon!\n— ~TM_Nails Art"
                )
            else:  # cancelled
                subject = "Your ~TM_Nails Art appointment was cancelled"
                body = (
                    f"Hi {instance.name},\n\n"
                    f"Unfortunately your appointment on {instance.preferred_date} at "
                    f"{instance.preferred_time} has been CANCELLED.\n\n"
                    f"Please contact us or rebook at your convenience.\n— ~TM_Nails Art"
                )

            send_mail(
                subject=subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.email],
                fail_silently=True,
            )