from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail

def get_uid_and_token(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    return uid, token

def get_frontend_url():
    frontend_url = getattr(settings, 'FRONTEND_URL', None)
    if not frontend_url:
        raise ValueError("FRONTEND_URL must be set in settings.py")
    return frontend_url

def send_activation_email(user):
    uid, token = get_uid_and_token(user)
    frontend_url = get_frontend_url()
    confirm_url = f"{frontend_url}/verify-email/?uid={uid}&token={token}"

    subject = "Activate Your Account"
    plain_message = f"Please confirm your email by clicking the link below: {confirm_url}"
    html_message = render_to_string(
        'accounts/confirmation_email.html', 
        {'button_url': confirm_url}
    )

    print(plain_message)

    send_mail(
        subject,
        plain_message,
        'noreply@example.com',
        [user.email],
        html_message=html_message
    )


def send_password_reset_email(user):
    uid, token = get_uid_and_token(user)
    frontend_url = get_frontend_url()
    reset_url = f"{frontend_url}/reset-password-confirm/?uid={uid}&token={token}"

    

    subject = "Reset Your Password"
    plain_message = f"Click the link to reset your password: {reset_url}"
    html_message = render_to_string(
        'accounts/password_reset_email.html', 
        {'button_url': reset_url}
    )

    print(plain_message)

    send_mail(
        subject,
        plain_message,
        'noreply@example.com',
        [user.email],
        html_message=html_message
    )
