# Python imports
import os

# Django imports
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

# Module imports
from plane.license.models import Instance, InstanceAdmin


class Command(BaseCommand):
    help = "Create default admin from environment variables"

    def handle(self, *args, **options):
        email = os.environ.get("DEFAULT_ADMIN_EMAIL")
        password = os.environ.get("DEFAULT_ADMIN_PASSWORD")

        if not email or not password:
            self.stdout.write(self.style.NOTICE("DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set, skipping"))
            return

        User = get_user_model()

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": os.environ.get("DEFAULT_ADMIN_FIRST_NAME", "Admin"),
                "last_name": os.environ.get("DEFAULT_ADMIN_LAST_NAME", ""),
                "is_superuser": True,
                "is_staff": True,
                "is_password_autoset": False,
            },
        )

        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Admin user created: {email}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Admin user already exists: {email}"))

        instance = Instance.objects.first()
        if instance:
            InstanceAdmin.objects.get_or_create(
                instance=instance, user=user, defaults={"role": 20}
            )
            if not instance.is_setup_done:
                instance.is_setup_done = True
                instance.save()
            self.stdout.write(self.style.SUCCESS("Instance admin registered"))
