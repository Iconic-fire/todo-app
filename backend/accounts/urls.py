from django.urls import path

from accounts import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path("csrf/", views.CSRFTokenView.as_view(), name="get_csrf"),
    path('refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify_email'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('reset-password-validate/', views.PasswordResetValidateView.as_view(), name='reset_password_validate'),
    path('password-reset-confirm/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]