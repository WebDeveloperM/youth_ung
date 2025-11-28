# 🎨 UNG Youth Admin Dashboard

Современная административная панель для управления платформой UNG Youth.

## 🚀 Что уже реализовано

### ✅ API Клиенты
- `authAPI` - аутентификация и авторизация
- `usersAPI` - управление пользователями
- `contentAPI` - управление всем контентом (news, grants, scholarships, competitions, innovations, internships, jobs, team)
- `commentsAPI` - модерация комментариев
- `analyticsAPI` - аналитика и статистика

### ✅ Страницы
1. **Dashboard** - главная страница с статистикой и графиками
2. **News** - управление новостями (список, создание, редактирование, удаление)
3. **Comments** - модерация комментариев (одобрение, удаление, массовые действия)
4. **Users** - управление пользователями
5. **Analytics** - детальная аналитика

### ✅ Функционал
- 📊 Real-time статистика на Dashboard
- 🔍 Поиск и фильтрация
- 📄 Пагинация
- 🎨 Современный UI/UX (дизайн сохранен!)
- 📱 Responsive дизайн
- ⚡ Быстрая загрузка с loading состояниями

## 📦 Установка

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать для продакшена
npm run build
```

## ⚙️ Настройка

### API Base URL

Измени URL бэкенда в файле `/src/api/client.ts`:

```typescript
const API_BASE_URL = 'http://172.20.10.2:8000/api/v1';
```

### Токен авторизации

Токен сохраняется в `localStorage` с ключом `admin_token`.

## 🎯 TODO (что нужно доделать)

### 1. Создать Backend Endpoints

Админка готова, но нужно создать API endpoints в Django:

```python
# В Django нужно добавить:
# /api/v1/admin/news/          - CRUD для новостей
# /api/v1/admin/grants/        - CRUD для грантов
# /api/v1/admin/scholarships/  - CRUD для стипендий
# /api/v1/admin/competitions/  - CRUD для конкурсов
# /api/v1/admin/innovations/   - CRUD для инноваций
# /api/v1/admin/internships/   - CRUD для стажировок
# /api/v1/admin/jobs/          - CRUD для вакансий
# /api/v1/admin/team/          - CRUD для команды
# /api/v1/admin/users/         - CRUD для пользователей
# /api/v1/admin/comments/      - Модерация комментариев
# /api/v1/admin/analytics/dashboard/  - Статистика
# /api/v1/admin/analytics/visitors/   - Посетители
# /api/v1/admin/analytics/pages/      - Аналитика страниц
```

### 2. Добавить остальные страницы контента

Создать аналогичные страницы для:
- Grants (по примеру News)
- Scholarships
- Competitions
- Innovations
- Internships
- Jobs
- Team

### 3. Формы создания/редактирования

Добавить модальные окна или отдельные страницы для:
- Создания нового контента
- Редактирования существующего
- Загрузки изображений
- Rich Text Editor для контента

### 4. Аутентификация

- Страница логина
- Защита роутов (PrivateRoute)
- Проверка роли пользователя (Admin/Moderator)

### 5. Rich Text Editor

Интегрировать для редактирования контента:
- React Quill
- или TipTap
- или CKEditor

## 📁 Структура проекта

```
dashboard/
├── src/
│   ├── api/              # API клиенты
│   │   ├── client.ts     # Axios инстанс
│   │   ├── auth.ts       # Аутентификация
│   │   ├── users.ts      # Пользователи
│   │   ├── content.ts    # Весь контент
│   │   ├── comments.ts   # Комментарии
│   │   └── analytics.ts  # Аналитика
│   ├── components/       # Переиспользуемые компоненты
│   │   ├── Layout.tsx    # Главный layout с sidebar
│   │   └── StatCard.tsx  # Карточка статистики
│   ├── pages/            # Страницы
│   │   ├── Dashboard.tsx # Главная страница
│   │   ├── News.tsx      # Управление новостями
│   │   ├── Comments.tsx  # Модерация комментариев
│   │   ├── Users.tsx     # Пользователи
│   │   └── Analytics.tsx # Аналитика
│   ├── data/             # Mock данные (fallback)
│   ├── types/            # TypeScript типы
│   ├── App.tsx           # Роуты
│   └── main.tsx          # Entry point
└── package.json
```

## 🎨 Дизайн

Дизайн сохранен как в оригинале:
- ✅ Sidebar с навигацией
- ✅ Header с уведомлениями
- ✅ Карточки статистики
- ✅ Таблицы с hover эффектами
- ✅ Цветовая схема (primary-500, green, blue, orange, purple)
- ✅ Иконки от Lucide React
- ✅ Графики от Recharts

## 🔧 Технологии

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP requests
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📱 Responsive

Админка адаптивна для:
- 📱 Mobile (< 640px)
- 💻 Tablet (640px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🚀 Запуск в сети

```bash
# Запустить с доступом из сети
npm run dev -- --host

# Откроется на:
# http://localhost:5173/
# http://172.20.10.2:5173/  (или твой IP)
```

## 📝 Примеры использования API

### Получить новости
```typescript
import { newsAPI } from './api';

const loadNews = async () => {
  const response = await newsAPI.getList({
    page: 1,
    page_size: 20,
    search: 'query',
    ordering: '-date',
  });
  console.log(response.results);
};
```

### Создать новость
```typescript
const createNews = async () => {
  const formData = {
    title_uz: 'Yangilik',
    title_ru: 'Новость',
    title_en: 'News',
    content_uz: '...',
    content_ru: '...',
    content_en: '...',
    image: fileObject,
    date: '2025-11-27',
    is_published: true,
  };
  
  const news = await newsAPI.create(formData);
};
```

### Модерировать комментарий
```typescript
import { commentsAPI } from './api';

// Одобрить
await commentsAPI.moderate(commentId, { is_moderated: true });

// Удалить
await commentsAPI.delete(commentId);

// Массовое действие
await commentsAPI.bulkModerate([1, 2, 3], 'approve');
```

## ⚠️ Важно

1. **Backend должен быть запущен** на `http://172.20.10.2:8000`
2. **CORS должен быть настроен** в Django для `http://172.20.10.2:5173`
3. **Токен аутентификации** должен быть в localStorage

## 🤝 Вклад

Создано с ❤️ для UNG Youth Platform

---

**Статус:** ✅ Базовый функционал готов  
**Версия:** 1.0.0  
**Дата:** 27 ноября 2025
