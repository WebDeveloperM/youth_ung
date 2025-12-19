# 🔧 Применение миграции для новых разделов

## Проблема
Docker не доступен из терминала Cursor. Нужно применить миграцию вручную.

## ✅ РЕШЕНИЕ - Выполните в вашем терминале:

### Вариант 1: Через Docker (рекомендуется)

Откройте **свой терминал** (Terminal.app или iTerm) и выполните:

```bash
cd /Users/admin/Desktop/youth_ung/backend
docker exec django_api python manage.py migrate content
```

### Вариант 2: Через Docker Compose

```bash
cd /Users/admin/Desktop/youth_ung/backend
docker-compose exec web python manage.py migrate content
```

### Вариант 3: Если Docker не запущен

1. Запустите Docker Desktop
2. Затем выполните:
```bash
cd /Users/admin/Desktop/youth_ung/backend
docker-compose up -d
docker exec django_api python manage.py migrate content
```

## 📊 Проверка после миграции

После применения миграции проверьте, что всё работает:

```bash
# Проверить доступность новых API
curl http://localhost:8000/api/v1/technologies/
curl http://localhost:8000/api/v1/projects/
curl http://localhost:8000/api/v1/research/
curl http://localhost:8000/api/v1/results/
```

Должны вернуться пустые списки `{"count": 0, "results": []}` или список записей, если вы уже добавили данные.

## 🎯 После успешной миграции:

1. Откройте Django Admin: `http://localhost:8000/admin/`
2. Теперь доступны новые разделы:
   - ✅ Технологии
   - ✅ Проекты  
   - ✅ Исследования
   - ✅ Результаты

3. Добавьте тестовые данные через админку

4. Проверьте API снова - данные должны появиться!

---

**Если возникли проблемы:**
- Убедитесь, что Docker Desktop запущен
- Проверьте, что контейнеры работают: `docker ps`
- Посмотрите логи: `docker logs django_api`

