# 🔐 Интеграция аутентификации Frontend ↔️ Backend

## ✅ Что было сделано:

### Backend API

1. **Созданы полноценные API endpoints:**
   - `/api/v1/users/sign-up/` - Регистрация нового пользователя
   - `/api/v1/users/sign-in/` - Вход пользователя

2. **Реализованы сериализаторы:**
   - `SignUpSerializer` - валидация и создание пользователя
   - `SignInSerializer` - проверка логина/пароля и выдача токена

3. **Система токенов:**
   - При регистрации/входе автоматически создается токен
   - Токен хранится в модели `Token`
   - Токен действителен 30 дней

### Frontend Integration

1. **Создан API клиент** (`/frontend/src/api/auth.js`):
   ```javascript
   authAPI.signUp(data)   // Регистрация
   authAPI.signIn(data)   // Вход
   authAPI.signOut()      // Выход
   authAPI.getCurrentUser() // Получить текущего пользователя
   authAPI.isAuthenticated() // Проверка авторизации
   ```

2. **Обновлен компонент Auth.jsx:**
   - Интегрирован с API
   - Обработка ошибок от сервера
   - Автоматическое перенаправление после успешной авторизации
   - Сохранение токена в localStorage

3. **Конфигурация:**
   - `.env` файл с `VITE_API_URL=http://localhost:8000/api/v1`

## 🚀 Как использовать:

### Запуск Backend

```bash
cd backend
docker-compose up -d
```

Backend доступен на: `http://localhost:8000`

### Запуск Frontend

```bash
cd frontend
npm install  # Если еще не установлено
npm run dev
```

Frontend доступен на: `http://localhost:5173` (или другой порт, указанный Vite)

### Тестирование регистрации

1. Откройте `http://localhost:5173/login`
2. Переключитесь на "Регистрация"
3. Заполните форму:
   - Полное имя: `Иван Иванов`
   - Дата рождения: `1990-01-01`
   - Телефон: `+998901234567`
   - Адрес: `Ташкент, ул. Навои 1`
   - Место работы: `IT Company`
   - Должность: `Developer`
   - Логин: `ivan@example.com` или `ivan`
   - Пароль: `123456`
   - Подтверждение пароля: `123456`
4. Нажмите "Регистрация"
5. После успеха автоматически перенаправит на главную

### Тестирование входа

1. Откройте `http://localhost:5173/login`
2. Введите:
   - Логин: `ivan@example.com` или `ivan`
   - Пароль: `123456`
3. Нажмите "Вход"
4. После успеха перенаправит на главную

## 📋 API Endpoints

### POST /api/v1/users/sign-up/

**Запрос:**
```json
{
  "full_name": "Иван Иванов",
  "date_of_birth": "1990-01-01",
  "phone_number": "+998901234567",
  "residential_address": "Ташкент, ул. Навои 1",
  "place_of_work": "IT Company",
  "position": "Developer",
  "login": "ivan@example.com",
  "password": "123456",
  "confirm_password": "123456"
}
```

**Ответ:**
```json
{
  "id": 1,
  "username": "ivan",
  "email": "ivan@example.com",
  "first_name": "Иван",
  "last_name": "Иванов",
  "phone": "+998901234567",
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "message": "Регистрация прошла успешно!"
}
```

### POST /api/v1/users/sign-in/

**Запрос:**
```json
{
  "login": "ivan@example.com",
  "password": "123456"
}
```

**Ответ:**
```json
{
  "id": 1,
  "username": "ivan",
  "email": "ivan@example.com",
  "first_name": "Иван",
  "last_name": "Иванов",
  "phone": "+998901234567",
  "role": "User",
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "message": "Вход выполнен успешно!"
}
```

## 🔧 Техничес details:

### Токены

- Хранятся в `users_token` таблице
- Автоматически генерируются при регистрации/входе
- Действительны 30 дней
- Используются для всех защищенных запросов

### localStorage

Frontend сохраняет в localStorage:
- `authToken` - токен аутентификации
- `user` - JSON объект с данными пользователя

### CORS

Backend настроен на прием запросов от:
- `http://localhost:3000`
- `http://127.0.0.1:8000`
- ngrok endpoints

### Валидация

**Регистрация:**
- Полное имя: минимум 3 символа
- Телефон: формат +XXX...
- Логин: минимум 4 символа, уникальный
- Пароль: минимум 6 символов
- Пароли должны совпадать

**Вход:**
- Логин обязателен
- Пароль обязателен

## 🐛 Отладка

### Проверка API через curl

**Регистрация:**
```bash
curl -X POST http://localhost:8000/api/v1/users/sign-up/ \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "date_of_birth": "1995-01-01",
    "phone_number": "+998901111111",
    "residential_address": "Test Address",
    "place_of_work": "Test Company",
    "position": "Tester",
    "login": "test@test.com",
    "password": "123456",
    "confirm_password": "123456"
  }'
```

**Вход:**
```bash
curl -X POST http://localhost:8000/api/v1/users/sign-in/ \
  -H "Content-Type: application/json" \
  -d '{
    "login": "test@test.com",
    "password": "123456"
  }'
```

### Проверка токена

```bash
curl -X GET http://localhost:8000/api/v1/users/info_user \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Логи Docker

```bash
docker-compose logs web --tail=50
```

## ⚠️ Известные проблемы

1. **CORS errors:** Убедитесь, что фронтенд запущен на правильном порту и добавлен в CORS_ALLOWED_ORIGINS
2. **Token not working:** Проверьте формат заголовка: `Authorization: Token abc123`
3. **Organization required:** Организация создается автоматически при регистрации

## 🎯 Следующие шаги

1. ✅ Регистрация и вход реализованы
2. ⏳ Профиль пользователя
3. ⏳ Восстановление пароля
4. ⏳ Редактирование профиля
5. ⏳ Защищенные маршруты на frontend
6. ⏳ Интеграция с остальными API endpoints (news, grants, etc.)

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи backend: `docker-compose logs web`
2. Проверьте консоль браузера (F12)
3. Убедитесь, что оба сервера запущены
4. Проверьте, что база данных доступна

---

**Готово к тестированию!** 🎉



