from django.db import models
from django.contrib.auth.models import AbstractBaseUser


#  Custom User Model
class User(AbstractBaseUser):
    username = None
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
