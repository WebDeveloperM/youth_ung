# 🚀 Быстрая справка UNG-youth

> Шпаргалка для быстрой ориентации в проекте

---

## 📁 Где что находится

### Компоненты
```
src/components/
├── navbar/          → Главная навигация
├── hero/            → Hero секция главной
├── footer/          → Футер
├── breadCrumb/      → Хлебные крошки
├── comments/        → Система комментариев
├── colorModeSelector/  → Dark/Light mode
├── langSelector/    → Переключатель языка (uz/ru/en)
├── userAvatar/      → Аватар + модальные формы входа
└── ui/              → Базовые UI компоненты (Radix UI)
```

### Страницы
```
src/pages/
├── homepage/        → Главная страница
├── jobsList/        → 💼 Список вакансий
├── jobDetail/       → 💼 Детали вакансии
├── internshipsList/ → 🎓 Список стажировок
├── scholarshipsList/→ 💰 Список стипендий
├── grantsList/      → 💵 Список грантов
├── competitionsList/→ 🏆 Список конкурсов
├── innovationsList/ → 💡 Список инноваций
├── newsList/        → 📰 Список новостей
├── team/            → 👥 Команда
└── about/           → ℹ️ О нас
```

### Данные (Mock)
```
src/datatest/
├── jobsData.js         → 💼 Вакансии
├── internshipsData.js  → 🎓 Стажировки
├── scholarshipsData.js → 💰 Стипендии
├── grantsData.js       → 💵 Гранты
├── competitionsData.js → 🏆 Конкурсы
├── innovationsData.js  → 💡 Инновации
├── newsData.js         → 📰 Новости
├── teamData.js         → 👥 Команда
├── aboutData.js        → ℹ️ О нас
└── commentsData.js     → 💬 Комментарии
```

### Переводы
```
src/i18n/locales/
├── uz/translation.json  → O'zbek tili
├── ru/translation.json  → Русский язык
└── en/translation.json  → English language
```

---

## 🛠️ Как добавить новую секцию

### 1. Создайте файл данных
```javascript
// src/datatest/myData.js
export const myData = [
  {
    id: 1,
    title: { uz: "...", ru: "...", en: "..." },
    shortDescription: { uz: "...", ru: "...", en: "..." },
    content: { uz: `<div>...</div>`, ru: `...`, en: `...` },
    image: '/images/my-image.jpg',
    status: 'active',
    // ... другие поля
  }
]
```

### 2. Создайте страницы
```bash
# Список
src/pages/myList/index.jsx

# Детали
src/pages/myDetail/index.jsx
```

### 3. Добавьте роуты в App.jsx
```javascript
import MyList from './pages/myList'
import MyDetail from './pages/myDetail'

<Route path="/my-section" element={<MyList />} />
<Route path="/my-section/:id" element={<MyDetail />} />
```

### 4. Добавьте в навигацию (navbar)
```javascript
// src/components/navbar/index.jsx
{
  title: t('menu.mySection'),
  subMenu: [
    { title: t('menu.sub.myItem'), url: '/my-section', icon: <Icon /> }
  ]
}
```

### 5. Добавьте переводы
```json
// src/i18n/locales/uz/translation.json
{
  "menu": {
    "mySection": "Mening bo'limim",
    "sub": {
      "myItem": "Mening elementim"
    }
  },
  "mySection": {
    "title": "Sarlavha",
    "description": "Tavsif",
    ...
  }
}
```

---

## 🎨 Как использовать стили

### TailwindCSS классы
```jsx
// Базовые
<div className="flex items-center justify-between">

// Адаптивность
<div className="text-sm md:text-base lg:text-lg">

// Dark mode
<div className="bg-white dark:bg-gray-900">

// Hover эффекты
<button className="hover:bg-blue-600 hover:scale-105">

// Custom utilities
<div className="flexCenter padding max-container">
```

### Цвета проекта
```javascript
primary:     #00A2DE  // Голубой
navy-blue:   oklch()  // Темно-синий
success:     #28a745  // Зеленый
error:       #dc3545  // Красный
```

### Готовые компоненты
```jsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog'

<Button variant="outline" size="lg">Нажми меня</Button>
<Input type="email" placeholder="Email" />
```

---

## 🌍 Работа с переводами

### Использование
```javascript
import { useTranslation } from 'react-i18next'

function Component() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language
  
  return (
    <>
      <h1>{t('jobs.title')}</h1>
      <p>{job.description[currentLang]}</p>
    </>
  )
}
```

### Смена языка
```javascript
const handleChange = (lang) => {
  i18n.changeLanguage(lang)
  localStorage.setItem('lang', lang)
}
```

---

## 🧩 Частые паттерны

### Получение ID из URL
```javascript
import { useParams } from 'react-router-dom'

function DetailPage() {
  const { id } = useParams()
  const item = data.find(x => x.id === Number(id))
}
```

### Анимации с Framer Motion
```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Контент
</motion.div>
```

### Навигация
```javascript
import { Link } from 'react-router-dom'

<Link to="/jobs/1">Вакансия</Link>
```

### HTML контент
```jsx
<div 
  dangerouslySetInnerHTML={{ __html: content[currentLang] }} 
  className="prose dark:prose-invert"
/>
```

---

## 🔧 Команды

```bash
# Разработка
npm run dev

# Билд
npm run build

# Preview билда
npm run preview

# Линтинг
npm run lint
```

---

## 📊 Структура данных

### Общие поля
```javascript
{
  id: number,
  title: { uz: string, ru: string, en: string },
  shortDescription: { uz: string, ru: string, en: string },
  content: { uz: html, ru: html, en: html },
  image: string (path),
  status: 'active' | 'closed',
  category: string
}
```

### Специфичные для вакансий
```javascript
{
  salary: string,
  location: string,
  experience: string,
  deadline: date,
  applicants: number,
  positions: number,
  employmentType: 'full-time' | 'part-time'
}
```

### Специфичные для стажировок
```javascript
{
  stipend: string,
  duration: string,
  deadline: date,
  startDate: date,
  applicants: number,
  positions: number
}
```

---

## 🎯 Useful Hooks

```javascript
// Роутинг
import { useParams, useNavigate, useLocation } from 'react-router-dom'

// Переводы
import { useTranslation } from 'react-i18next'

// React базовые
import { useState, useEffect, useMemo, useCallback } from 'react'
```

---

## 🚨 Важные заметки

1. **Всегда используйте мультиязычность:**
   ```javascript
   // ❌ Плохо
   <h1>Вакансии</h1>
   
   // ✅ Хорошо
   <h1>{t('jobs.title')}</h1>
   ```

2. **Dark mode поддержка:**
   ```javascript
   // ✅ Всегда добавляйте dark: варианты
   className="bg-white dark:bg-gray-900"
   ```

3. **Responsive дизайн:**
   ```javascript
   // ✅ Используйте breakpoints
   className="text-sm md:text-base lg:text-lg"
   ```

4. **Анимации:**
   ```javascript
   // ✅ Добавляйте плавные переходы
   className="transition-all duration-300"
   ```

---

## 🔍 Debugging

### React DevTools
```javascript
// Установите расширение React DevTools для Chrome/Firefox
```

### Console logs
```javascript
console.log('Current language:', i18n.language)
console.log('Job data:', job)
console.log('Route params:', useParams())
```

### Vite HMR
- Изменения автоматически обновляются
- Если что-то сломалось - перезагрузите страницу

---

## 📞 Контакты и ресурсы

- **Основная документация:** `PROJECT_ARCHITECTURE.md`
- **React Docs:** https://react.dev/
- **TailwindCSS:** https://tailwindcss.com/
- **Radix UI:** https://www.radix-ui.com/

---

**Последнее обновление:** 24 ноября 2025

