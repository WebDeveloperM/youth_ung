#!/usr/bin/env python
"""
Superadmin seed script.
Creates the superadmin user if it does not exist.
Deactivates all other non-superuser accounts so the DB starts clean.

Usage:
    python create_superadmin.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

SUPERADMIN_EMAIL    = 'admin@ung.uz'
SUPERADMIN_USERNAME = 'admin'
SUPERADMIN_PASSWORD = 'Admin@ung1234'   # change after first login


def create_superadmin():
    print("=" * 60)
    print("  Superadmin seed")
    print("=" * 60)

    # 1. Deactivate every non-superuser account so no stray test users remain active
    deactivated = User.objects.filter(is_superuser=False, is_active=True).update(is_active=False)
    if deactivated:
        print(f"⚠️  Deactivated {deactivated} non-superuser account(s).")

    # 2. Create or update the superadmin
    user = User.objects.filter(email=SUPERADMIN_EMAIL).first()

    if user:
        # Make sure the existing account is fully set up as superadmin
        changed = False
        if not user.is_superuser:
            user.is_superuser = True
            changed = True
        if not user.is_staff:
            user.is_staff = True
            changed = True
        if not user.is_active:
            user.is_active = True
            changed = True
        if user.role != 'Admin':
            user.role = 'Admin'
            changed = True
        if changed:
            user.save()
        print(f"ℹ️  Superadmin already exists — email: {SUPERADMIN_EMAIL}")
    else:
        user = User(
            email=SUPERADMIN_EMAIL,
            username=SUPERADMIN_USERNAME,
            first_name='Super',
            last_name='Admin',
            is_superuser=True,
            is_staff=True,
            is_active=True,
            role='Admin',
            phone='+998000000000',
            address='Toshkent',
            gender='Erkak',
            confirm_password=SUPERADMIN_PASSWORD,
        )
        user.set_password(SUPERADMIN_PASSWORD)
        user.save()
        print(f"✅ Superadmin created!")
        print(f"   Email   : {SUPERADMIN_EMAIL}")
        print(f"   Password: {SUPERADMIN_PASSWORD}")
        print(f"   ⚠️  Change the password after first login!")

    print("=" * 60)


if __name__ == '__main__':
    create_superadmin()
