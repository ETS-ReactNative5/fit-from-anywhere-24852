from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from rest_auth.models import TokenModel

from home.models import CustomText, HomePage
from users.models import Profile

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}},
            "email": {
                "required": True,
                "allow_blank": False,
            },
        }

    def _get_request(self):
        request = self.context.get("request")
        if (
            request
            and not isinstance(request, HttpRequest)
            and hasattr(request, "_request")
        ):
            request = request._request
        return request

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address.")
                )
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get("email"),
            name=validated_data.get("name"),
            username=generate_unique_username(
                [validated_data.get("name"), validated_data.get("email"), "user"]
            ),
        )
        user.set_password(validated_data.get("password"))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class CustomTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomText
        fields = "__all__"


class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name"]


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""

    password_reset_form_class = ResetPasswordForm


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = [
            "id",
            "profile_image",
            "user",
            "is_trainer",
            "student_campus_residential_address",
            "gender",
            "age",
            "dob",
            "fitness_goal",
            "height_metric",
            "weight_metric",
            "weight",
            "height",
            "trial_code",
        ]

    def create(self, validated_data):
        # breakpoint()
        instance = super().create(validated_data)
        return instance

    def update(self, instance, validated_data):
        user = validated_data.pop("user", None)
        if user:
            _user = User.objects.get(id=instance.user.id)
            if "name" in user:
                _user.name = user.get("name")
            if "is_agent" in user:
                _user.is_agent = user.get("is_agent")
            _user.save()
            instance.user = _user
        instance.save()
        instance = super().update(instance, validated_data)
        return instance


class TokenSerializer(serializers.ModelSerializer):
    """
    Serializer for Token model.
    """

    user = UserSerializer(read_only=True)
    profile = serializers.SerializerMethodField(read_only=True)
    # address = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TokenModel
        fields = ("key", "user", "profile")

    # def get_address(self, obj):
    #     query = Address.objects.filter(user=obj.user)
    #     if query.exists():
    #         return AddressSerializer(query[0]).data
    #     return None

    def get_profile(self, obj):
        query = Profile.objects.get(user=obj.user)
        return UserProfileSerializer(query).data
