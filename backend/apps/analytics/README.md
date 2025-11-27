# Система аналитики UNG Youth

## Описание

Полнофункциональная система аналитики для отслеживания посетителей, просмотров страниц и активности пользователей в админ-панели Django.

## Возможности

### 📊 Дашборд аналитики

Красивый дашборд с визуализацией данных, доступный по адресу `/admin/analytics/dashboard/`

**Основные метрики:**
- Статистика посетителей (сегодня, неделя, месяц)
- Уникальные посетители
- Просмотры страниц
- Среднее время на сайте
- Статистика публикаций по категориям
- Топ контента по просмотрам
- Активность пользователей админки
- Топ авторов по публикациям

**Графики:**
- График посетителей за последние 7 дней (линейный)
- График просмотров за последние 7 дней (столбчатый)
- График публикаций за последние 7 дней (линейный с заливкой)
- Распределение по устройствам (круговая диаграмма)
- Распределение по браузерам (круговая диаграмма)

### 🔍 Отслеживание

**Автоматическое отслеживание:**
- IP-адрес посетителя
- User Agent (браузер, ОС, устройство)
- Просмотренные страницы (URL, путь, метод, статус)
- Источник перехода (referer)
- Время просмотра

**Определение:**
- Типа устройства (mobile, tablet, desktop)
- Браузера (Chrome, Firefox, Safari, Edge, Opera, IE)
- Операционной системы (Windows, macOS, Linux, Android, iOS)
- Уникальных vs возвращающихся посетителей

### 📈 Модели данных

1. **Visitor** - информация о посетителях
   - IP-адрес, User Agent
   - Связь с пользователем (если авторизован)
   - Браузер, ОС, устройство
   - Количество визитов, первый и последний визит
   - Геолокация (страна, город) - опционально

2. **PageView** - просмотры страниц
   - Посетитель, URL, путь
   - HTTP метод и статус код
   - Источник перехода
   - Время просмотра и проведенное время на странице
   - Generic relation к любому контенту

3. **ContentStatistics** - агрегированная статистика по контенту
   - Тип контента и ID объекта
   - Дата
   - Количество просмотров, уникальных посетителей
   - Лайки, репосты

4. **UserActivity** - активность пользователей админки
   - Пользователь, действие (create, update, delete, view, login, logout)
   - Тип контента и ID объекта
   - Описание, время, IP-адрес

5. **DailyStats** - ежедневная агрегированная статистика
   - Все метрики за день
   - Статистика по посетителям, просмотрам, публикациям
   - Распределение по устройствам

## Использование

### Доступ к дашборду

1. Войдите в админ-панель Django: `http://localhost:8000/admin/`
2. В верхнем меню нажмите "📊 Аналитика"
3. Или перейдите напрямую: `http://localhost:8000/admin/analytics/dashboard/`

### Просмотр детальных данных

В разделе "Аналитика и статистика" в боковом меню доступны:
- **Посетители** - список всех посетителей с фильтрами
- **Просмотры страниц** - детальный лог просмотров
- **Статистика контента** - статистика по каждому контенту
- **Активность пользователей** - лог действий админов
- **Ежедневная статистика** - агрегированные данные по дням

### Генерация ежедневной статистики

Для агрегации статистики за день используйте management команду:

```bash
# За вчерашний день (по умолчанию)
docker-compose exec web python manage.py generate_daily_stats

# За конкретную дату
docker-compose exec web python manage.py generate_daily_stats --date 2025-11-24
```

**Рекомендация:** Добавьте команду в cron для ежедневного автоматического запуска:

```bash
# Каждый день в 00:05
5 0 * * * cd /path/to/project && docker-compose exec -T web python manage.py generate_daily_stats
```

## Middleware

Middleware `AnalyticsMiddleware` автоматически отслеживает все запросы к сайту (кроме статических файлов).

**Исключенные пути:**
- `/admin/jsi18n/`
- `/static/`, `/media/`, `/uploads/`
- Файлы изображений и статичные ресурсы (`.ico`, `.png`, `.jpg`, `.css`, `.js`)

## API для программного доступа

Вы можете создать API endpoints для доступа к аналитике из фронтенда:

```python
from analytics.models import Visitor, PageView
from django.db.models import Count
from datetime import timedelta
from django.utils import timezone

# Посетители за последние 7 дней
week_ago = timezone.now() - timedelta(days=7)
visitors = Visitor.objects.filter(last_visit__gte=week_ago).count()

# Самые популярные страницы
top_pages = PageView.objects.values('path').annotate(
    count=Count('id')
).order_by('-count')[:10]
```

## Расширение функционала

### Добавление геолокации

Для определения страны и города посетителей установите GeoIP2:

```bash
pip install geoip2
```

И добавьте в middleware логику определения геолокации по IP.

### Отслеживание событий

Вы можете расширить систему для отслеживания кастомных событий:

```python
from analytics.models import UserActivity
from django.contrib.contenttypes.models import ContentType

# Логирование создания контента
content_type = ContentType.objects.get_for_model(news)
UserActivity.objects.create(
    user=request.user,
    action='create',
    content_type=content_type,
    object_id=news.id,
    description=f'Создана новость: {news.title}',
    ip_address=request.META.get('REMOTE_ADDR')
)
```

### Экспорт данных

Добавьте action в admin для экспорта статистики:

```python
from django.http import HttpResponse
import csv

@admin.action(description='Экспорт в CSV')
def export_to_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="analytics.csv"'
    writer = csv.writer(response)
    # ... логика экспорта
    return response
```

## Производительность

Для оптимизации производительности на больших объемах данных:

1. **Индексы** - уже добавлены на часто используемые поля
2. **Агрегация** - используйте `DailyStats` для исторических данных
3. **Очистка старых данных** - создайте команду для удаления старых `PageView` записей:

```python
# Удалить записи старше 90 дней
old_date = timezone.now() - timedelta(days=90)
PageView.objects.filter(timestamp__lt=old_date).delete()
```

## Интеграция с фронтендом

Для отправки дополнительных данных с фронтенда (например, время на странице):

```javascript
// При закрытии/уходе со страницы
window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - pageStartTime;
    navigator.sendBeacon('/api/analytics/track/', JSON.stringify({
        page: window.location.pathname,
        timeSpent: Math.round(timeSpent / 1000) // в секундах
    }));
});
```

## Безопасность

- Дашборд доступен только авторизованным staff пользователям
- Данные посетителей анонимизированы (хранится только IP)
- Соблюдение GDPR: добавьте политику конфиденциальности
- Не логируются запросы к статическим файлам

## Troubleshooting

**Проблема:** Дашборд не отображается
**Решение:** Убедитесь, что пользователь имеет права staff и прошел авторизацию

**Проблема:** Middleware не работает
**Решение:** Проверьте, что `analytics.middleware.AnalyticsMiddleware` добавлен в `MIDDLEWARE` в `settings.py`

**Проблема:** Ошибка "Visitor matching query does not exist"
**Решение:** Убедитесь, что middleware запущен и база данных доступна

## Поддержка

Для вопросов и предложений обращайтесь к разработчикам UNG Youth Platform.



