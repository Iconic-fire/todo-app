from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from accounts import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify_email'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
]