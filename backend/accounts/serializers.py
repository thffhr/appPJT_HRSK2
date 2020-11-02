from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import models
from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    profileImage = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'email', 'nickname', 'password', 'height', 'weight',
                  'age', 'sex', 'active', 'basal_metabolism', 'profileImage', 'num_of_followings', 'num_of_followers']
