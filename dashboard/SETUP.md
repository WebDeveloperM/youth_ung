# 🚀 Админка UNG Youth - Готово к работе!

## ✅ Что сделано

### Backend (Django API)
1. ✅ **Admin API endpoints для всего контента:**
   - `/api/v1/admin/news/` - Новости
   - `/api/v1/admin/grants/` - Гранты
   - `/api/v1/admin/scholarships/` - Стипендии
   - `/api/v1/admin/competitions/` - Конкурсы
   - `/api/v1/admin/innovations/` - Инновации
   - `/api/v1/admin/internships/` - Стажировки
   - `/api/v1/admin/jobs/` - Вакансии
   - `/api/v1/admin/team/` - Команда

2. ✅ **Admin Analytics API:**
   - `/api/v1/admin/analytics/dashboard/` - Статистика для dashboard
   - `/api/v1/admin/analytics/visitors/` - Статистика посетителей
   - `/api/v1/admin/analytics/pages/` - Аналитика страниц

3. ✅ **Права доступа:**
   - Только Admin и Moderator могут использовать admin API
   - Требуется Token аутентификация

### Frontend (React Dashboard)
1. ✅ **Все страницы контента:**
   - Dashboard (главная с графиками)
   - News (новости)
   - Grants (гранты)
   - Scholarships (стипендии)
   - Competitions (конкурсы)
   - Innovations (инновации)
   - Internships (стажировки)
   - Jobs (вакансии)
   - Team (команда)
   - Comments (модерация комментариев)
   - Users (пользователи)
   - Analytics (аналитика)

2. ✅ **Универсальный компонент ContentListPage:**
   - Переиспользуемый для всех типов контента
   - Встроенный поиск
   - Пагинация
   - CRUD операции (просмотр, удаление)

3. ✅ **API клиенты:**
   - Axios интеграция
   - Автоматическая отправка токена
   - Error handling

4. ✅ **Современный дизайн:**
   - Дизайн из оригинала сохранен!
   - Sidebar навигация
   - Карточки статистики
   - Таблицы с фильтрами
   - Responsive layout

## 🚀 Запуск

### 1. Backend (Django)
```bash
cd /Users/admin/Desktop/youth_ung/backend
docker compose up
```

Backend запустится на: `http://172.20.10.2:8000`

### 2. Frontend (Dashboard)
```bash
cd /Users/admin/Desktop/youth_ung/dashboard
npm run dev -- --host
```

Dashboard запустится на: `http://172.20.10.2:5173`

## 🔑 Авторизация

1. Войти в систему через существующий API `/api/v1/users/sign-in/`
2. Токен сохраняется в localStorage
3. Роль пользователя должна быть **Admin** или **Moderator**

### Создать админа (если нет):
```bash
docker compose exec web python manage.py createsuperuser --email admin@admin.com --username admin
```

## 📊 Функционал

### Что работает:
- ✅ Просмотр всех типов контента
- ✅ Поиск по контенту
- ✅ Пагинация
- ✅ Удаление контента
- ✅ Модерация комментариев
- ✅ Массовые действия (комментарии)
- ✅ Статистика на dashboard
- ✅ Графики аналитики

### Что нужно доработать:
- ⏳ Формы создания/редактирования контента (сейчас только просмотр/удаление)
- ⏳ Rich Text Editor для контента
- ⏳ Загрузка изображений
- ⏳ Редактирование пользователей

## 📝 Как добавить форму создания

### Пример для News:

```typescript
// В News.tsx добавить модальное окно

const [isModalOpen, setIsModalOpen] = useState(false);
const [formData, setFormData] = useState({
  title_uz: '',
  title_ru: '',
  title_en: '',
  content_uz: '',
  content_ru: '',
  content_en: '',
  date: new Date().toISOString().split('T')[0],
  is_published: true,
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await newsAPI.create(formData);
    loadNews();
    setIsModalOpen(false);
  } catch (error) {
    console.error(error);
  }
};
```

## 🎨 Дизайн

Дизайн полностью сохранен из оригинального проекта dashboard:
- Цветовая схема (primary-500, green, blue, orange, purple)
- Sidebar с иконками
- Карточки статистики
- Таблицы с hover эффектами
- Современные кнопки и формы

## 🔧 API Примеры

### Получить новости
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://172.20.10.2:8000/api/v1/admin/news/
```

### Создать новость
```bash
curl -X POST \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title_uz": "Yangilik",
    "title_ru": "Новость",
    "title_en": "News",
    "content_uz": "...",
    "content_ru": "...",
    "content_en": "...",
    "date": "2025-11-27",
    "is_published": true
  }' \
  http://172.20.10.2:8000/api/v1/admin/news/
```

### Получить статистику
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://172.20.10.2:8000/api/v1/admin/analytics/dashboard/
```

## 📱 Доступ из сети

Dashboard уже настроен для доступа из локальной сети:
- Frontend: `http://172.20.10.2:5173`
- Backend: `http://172.20.10.2:8000`

Другие устройства в сети могут открыть админку по этим адресам.

## 🐛 Troubleshooting

### Backend не запускается
```bash
cd backend
docker compose down
docker compose up --build
```

### Frontend ошибка "axios not found"
```bash
cd dashboard
npm install
```

### CORS ошибка
Проверь что в `backend/config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://172.20.10.2:5173',
    'http://localhost:5173',
]
```

### Нет данных в dashboard
1. Проверь что Django запущен
2. Проверь что есть токен в localStorage
3. Проверь роль пользователя (должна быть Admin или Moderator)

## 🎯 Следующие шаги

1. **Добавить формы создания:**
   - Можно использовать модальные окна
   - Или отдельные страницы `/news/create`, `/news/edit/:id`

2. **Rich Text Editor:**
   ```bash
   npm install react-quill
   ```
   или
   ```bash
   npm install @tiptap/react @tiptap/starter-kit
   ```

3. **Загрузка изображений:**
   - Использовать FormData для отправки файлов
   - API уже поддерживает multipart/form-data

4. **Аутентификация:**
   - Добавить страницу логина
   - PrivateRoute для защиты роутов
   - Проверка роли пользователя

## ✨ Итого

**Админка полностью функциональна для:**
- ✅ Просмотра всего контента
- ✅ Удаления контента
- ✅ Модерации комментариев
- ✅ Просмотра статистики
- ✅ Управления пользователями (просмотр)

**Для полноценной работы нужно добавить:**
- ⏳ Формы создания/редактирования (30-60 минут работы)
- ⏳ Rich Text Editor (15-30 минут)
- ⏳ Загрузку изображений (15-30 минут)

---

**Создано:** 27 ноября 2025  
**Статус:** ✅ Базовый функционал работает, можно использовать!  
**Дизайн:** ✅ Сохранен и улучшен!

