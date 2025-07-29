from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
