from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from accounts.mails import send_activation_email, send_password_reset_email
from accounts.serializers import (
    ChangePasswordRequestSerializer,
    ChangePasswordResponseSerializer,
    LoginErrorResponseSerializer,
    LoginRequestSerializer, 
    LoginResponseSerializer, 
    LogoutSerializer,
    PasswordResetConfirmationRequestSerializer,
    PasswordResetConfirmationResponseSerializer,
    PasswordResetErrorSerializer,
    PasswordResetRequestSerializer,
    PasswordResetResponseSerializer,
    PasswordResetValidateResponseSerializer,
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
    serializer_class = LoginRequestSerializer
    permission_classes = [AllowAny]

    @extend_schema(
        responses={
            status.HTTP_200_OK: LoginResponseSerializer,
            status.HTTP_401_UNAUTHORIZED: LoginErrorResponseSerializer,
            status.HTTP_403_FORBIDDEN: LoginErrorResponseSerializer
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = User.objects.get(email=email)

        if not user or not check_password(password, user.password):
            return Response(
                LoginErrorResponseSerializer({"error": "Invalid credentials"}).data,
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            # TODO: In future, consider sending a new activation email if old one is expired or user explicitly requests it
            # we can use cache on email send and check if the user has already been sent an activation email 
            send_activation_email(user)
            return Response(
                LoginErrorResponseSerializer({
                    "error": "Account not activated. A new activation link has been sent to your email."
                }).data,
                status=status.HTTP_403_FORBIDDEN
            )

        tokens = get_tokens_for_user(user)
        return Response(
            LoginResponseSerializer({"message": "Login successful", "tokens": tokens}).data,
            status=status.HTTP_200_OK
        )

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
        send_activation_email(user)
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
        # TODO: handle specific exceptions
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
            send_password_reset_email(user)
            return Response(
                PasswordResetResponseSerializer({"message": "Password reset link sent to your email."}).data, 
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                PasswordResetErrorSerializer({"error": "No user with this email."}).data,
                status=status.HTTP_404_NOT_FOUND
            )

class PasswordResetValidateView(GenericAPIView):
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
            status.HTTP_200_OK: PasswordResetValidateResponseSerializer,
            status.HTTP_400_BAD_REQUEST: {}
        }
    )
    def get(self, request):
        uidb64 = request.query_params.get('uid')
        token = request.query_params.get('token')

        if not uidb64 or not token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            return Response(
                PasswordResetValidateResponseSerializer({'message': 'Token is valid'}).data, 
                status=status.HTTP_200_OK
            )
        return Response(status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmationRequestSerializer

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
        request=PasswordResetConfirmationRequestSerializer,
        responses={
            status.HTTP_200_OK: PasswordResetConfirmationResponseSerializer,
            status.HTTP_400_BAD_REQUEST: {}
        }
    )
    def post(self, request):
        uid = request.query_params.get('uid')
        token = request.query_params.get('token')

        if not uid or not token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['password']

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response(
                PasswordResetConfirmationResponseSerializer({"message": "Password has been reset successfully"}).data,
                status=status.HTTP_200_OK
            )

        return Response(status=status.HTTP_400_BAD_REQUEST)
