from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
# from django.core.mail import send_mail
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from accounts.serializers import (
    ChangePasswordRequestSerializer,
    ChangePasswordResponseSerializer,
    LoginSerializerRequest, 
    LoginSerializerResponse, 
    LogoutSerializer,
    PasswordResetErrorSerializer,
    PasswordResetRequestSerializer,
    PasswordResetResponseSerializer,
    SignupRequestSerializer,
    SignUpSerializerResponse, 
    VerifyEmailResponseSerializer,
)

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class LoginView(GenericAPIView):
    serializer_class = LoginSerializerRequest
    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            status.HTTP_200_OK: LoginSerializerResponse
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        # TODO: store refresh token to client cookie http only
        return Response({"message": "Login successful", "tokens": tokens})

class LogoutView(GenericAPIView):
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # TODO: read refresh token from client cookie http only
        refresh_token = serializer.validated_data["refresh"]
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

class SignupView(GenericAPIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=SignupRequestSerializer,
        responses={
            status.HTTP_201_CREATED: SignUpSerializerResponse,
            status.HTTP_400_BAD_REQUEST: {}
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = SignupRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url=getattr(settings, 'FRONTEND_URL')
        assert frontend_url, "FRONTEND_URL must be set in settings.py"
        confirm_url = f"{frontend_url}/verify-email/?uid={uid}&token={token}"
        
        print(f"Confirm your email by clicking here: {confirm_url}")

        # TODO: configure email settings and send confirmation email
        # send_mail(
        #     "Confirm your email",
        #     f"Click here to confirm: {confirm_url}",
        #     'noreply@example.com',
        #     [user.email],
        # )
        return Response(
            SignUpSerializerResponse({"message": "User created successfully.", "email": user.email}).data,
            status=status.HTTP_201_CREATED
        )

class VerifyEmailView(GenericAPIView):
    permission_classes = [AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="uid",
                required=True,
                type=OpenApiTypes.STR,
                description="User ID encoded in base64"
            ),
            OpenApiParameter(
                name="token",
                required=True,
                type=OpenApiTypes.STR,
                description="Token for email verification"
            )
        ],
        responses={
            status.HTTP_200_OK: VerifyEmailResponseSerializer,
            status.HTTP_400_BAD_REQUEST: {}
        }
    )
    def get(self, request): 
        # TODO: use serializer for query params
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            # print("Invalid UID")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response(
                VerifyEmailResponseSerializer({"message": "Email confirmed successfully."}).data,
                status=status.HTTP_200_OK
            )
        # print("Invalid or expired token.")
        return Response(status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordRequestSerializer

    @extend_schema(
        request=ChangePasswordRequestSerializer,
        responses={
            status.HTTP_200_OK: ChangePasswordResponseSerializer,
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        new_password = serializer.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return Response(
            ChangePasswordResponseSerializer({"message": "Password changed successfully."}).data,
            status=status.HTTP_200_OK
        )


class PasswordResetView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer

    @extend_schema(
        request=PasswordResetRequestSerializer, 
        responses={
            status.HTTP_200_OK: PasswordResetResponseSerializer,
            status.HTTP_404_NOT_FOUND: PasswordResetErrorSerializer
        }  
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url=getattr(settings, 'FRONTEND_URL')
            assert frontend_url, "FRONTEND_URL must be set in settings.py"
            reset_url = f"{frontend_url}/verify-email/?uid={uid}&token={token}"

            print(f"Reset your password by clicking here: {reset_url}")
            
            # TODO: configure email settings and send reset email
            # send_mail(
            #     "Reset your password",
            #     f"Click the link: {reset_url}",
            #     'noreply@example.com',
            #     [user.email],
            # )
            return Response(
                PasswordResetResponseSerializer({"message": "Password reset link sent to your email."}).data, 
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                PasswordResetErrorSerializer({"error": "No user with this email."}).data,
                status=status.HTTP_404_NOT_FOUND
            )