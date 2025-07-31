from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()

class TokensSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class LoginSerializerRequest(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class LoginSerializerResponse(serializers.Serializer):
    message = serializers.CharField()
    tokens = TokensSerializer()

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()