from django.db import connection
from django.db.models import Func, IntegerField


class NaturalOrder(Func):
    name = 'NaturalOrder'
    template = "SUBSTRING(%(expressions)s FROM '^[0-9]+')::INT"
    output_field = IntegerField()


def dict_fetch_one(cursor):
    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, cursor.fetchone()))


def dict_fetch(cursor):
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def raw_sql(sql, params=None):
    """
    Безопасное выполнение SQL запросов с параметризацией
    
    Args:
        sql: SQL запрос с placeholders (%s)
        params: Список или tuple параметров
    
    Example:
        # ✅ ПРАВИЛЬНО:
        raw_sql("SELECT * FROM users WHERE name = %s", ['John'])
        
        # ❌ НЕПРАВИЛЬНО (SQL Injection):
        raw_sql(f"SELECT * FROM users WHERE name = '{name}'")
    
    Security: ВСЕГДА используйте параметризованные запросы!
    """
    with connection.cursor() as cursor:
        cursor.execute(sql, params or [])
        return dict_fetch(cursor)


def raw_sql_one(sql, params=None):
    """
    Безопасное выполнение SQL запроса с возвратом одной строки
    
    Args:
        sql: SQL запрос с placeholders (%s)
        params: Список или tuple параметров
    
    Example:
        raw_sql_one("SELECT * FROM users WHERE id = %s", [user_id])
    
    Security: ВСЕГДА используйте параметризованные запросы!
    """
    with connection.cursor() as cursor:
        cursor.execute(sql, params or [])
        return dict_fetch_one(cursor)
