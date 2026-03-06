#!/usr/bin/env python3
"""
Скрипт для применения миграции category к таблице content_team_members
"""
import psycopg2
import os

# Параметры подключения — читаем из переменных окружения
DB_CONFIG = {
    'dbname': os.environ.get('POSTGRES_DB', 'youth_database'),
    'user': os.environ.get('POSTGRES_USER', 'postgres'),
    'password': os.environ.get('POSTGRES_PASSWORD', ''),
    'host': os.environ.get('HOST', 'localhost'),
    'port': int(os.environ.get('POSTGRES_PORT', 5433)),
}

def apply_migration():
    """Применить миграцию для добавления поля category"""
    try:
        # Подключение к базе данных
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # Проверяем, существует ли уже колонка
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='content_team_members' AND column_name='category'
        """)
        
        if cur.fetchone():
            print("✅ Колонка 'category' уже существует!")
            return
        
        print("📝 Применяю миграцию: добавляю колонку 'category'...")
        
        # Добавляем колонку category
        cur.execute("""
            ALTER TABLE content_team_members 
            ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'leadership'
        """)
        
        # Добавляем constraint для проверки допустимых значений
        cur.execute("""
            ALTER TABLE content_team_members 
            ADD CONSTRAINT content_team_members_category_check 
            CHECK (category IN ('leadership', 'innovation', 'education', 'media', 'sports'))
        """)
        
        # Записываем миграцию в таблицу django_migrations
        cur.execute("""
            INSERT INTO django_migrations (app, name, applied)
            VALUES ('content', '0011_teammember_category', NOW())
        """)
        
        conn.commit()
        print("✅ Миграция успешно применена!")
        print("✅ Поле 'category' добавлено в таблицу content_team_members")
        
        cur.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"❌ Ошибка базы данных: {e}")
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == '__main__':
    apply_migration()

