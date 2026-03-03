# 🔧 Инструкции по применению миграции

## Проблема
При редактировании члена команды в админ-панели возникает ошибка 500, потому что в базе данных отсутствует колонка `category`.

## Решение

Необходимо применить миграцию `0011_teammember_category.py` к базе данных PostgreSQL.

### Вариант 1: Через Docker (рекомендуется)

```bash
cd /Users/admin/Desktop/youth_ung/backend
docker exec -i postgres_db psql -U postgres -d youth_database < add_category_column.sql
```

### Вариант 2: Через Docker Compose

```bash
cd /Users/admin/Desktop/youth_ung/backend
docker-compose exec web python manage.py migrate content
```

### Вариант 3: Через psql напрямую

```bash
PGPASSWORD=qwerty1514 psql -h localhost -p 5433 -U postgres -d youth_database -f add_category_column.sql
```

### Вариант 4: Вручную через SQL

Подключитесь к базе данных и выполните:

```sql
-- Добавляем колонку category
ALTER TABLE content_team_members 
ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'leadership';

-- Добавляем constraint
ALTER TABLE content_team_members 
ADD CONSTRAINT content_team_members_category_check 
CHECK (category IN ('leadership', 'innovation', 'education', 'media', 'sports'));

-- Записываем миграцию
INSERT INTO django_migrations (app, name, applied)
VALUES ('content', '0011_teammember_category', NOW());
```

## Проверка

После применения миграции проверьте:

```bash
# Проверка через API
curl http://localhost:8000/api/v1/team/

# Должен вернуть список без ошибок и с полем category
```

## Параметры подключения к БД

- **Host:** localhost
- **Port:** 5433
- **Database:** youth_database
- **User:** postgres
- **Password:** qwerty1514

---

**Примечание:** После применения миграции перезапустите Django сервер, если требуется.

