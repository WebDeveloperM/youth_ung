#!/bin/bash
# ПРОСТО ЗАПУСТИ ЭТО!

cd /Users/admin/Desktop/youth_ung/backend

# Применяем миграции
docker-compose exec web python manage.py migrate

# Всё!
echo "✅ Миграции применены!"

