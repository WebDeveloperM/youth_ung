# 🔌 API Structure для Backend интеграции

> Документация для разработки Backend API на основе текущей структуры данных

---

## 📋 Обзор

Этот документ описывает структуру API endpoints, которые необходимо реализовать на Backend для замены mock данных из `src/datatest/`.

---

## 🎯 Base URL

```
Разработка:  http://localhost:3000/api/v1
Продакшн:    https://api.ung-youth.uz/api/v1
```

---

## 🔐 Аутентификация

### Endpoints

```http
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
GET    /auth/me
```

### Request/Response Examples

#### POST /auth/register
```json
// Request
{
  "fullName": "John Doe",
  "dateOfBirth": "1995-05-15",
  "phoneNumber": "+998901234567",
  "residentialAddress": "Tashkent, Yunusabad",
  "placeOfWork": "UNG",
  "position": "Developer",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/login
```json
// Request
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": { "id": 1, "fullName": "John Doe", "email": "john@example.com" },
    "tokens": { "accessToken": "...", "refreshToken": "...", "expiresIn": 3600 }
  }
}
```

---

## 💼 Jobs (Вакансии)

### Endpoints

```http
GET    /jobs              # Список всех вакансий
GET    /jobs/:id          # Детали вакансии
POST   /jobs              # Создать вакансию (admin)
PUT    /jobs/:id          # Обновить вакансию (admin)
DELETE /jobs/:id          # Удалить вакансию (admin)
POST   /jobs/:id/apply    # Подать заявку на вакансию
GET    /jobs/stats        # Статистика по вакансиям
```

### Data Structure

```typescript
interface Job {
  id: number;
  title: {
    uz: string;
    ru: string;
    en: string;
  };
  shortDescription: {
    uz: string;
    ru: string;
    en: string;
  };
  content: {
    uz: string; // HTML
    ru: string; // HTML
    en: string; // HTML
  };
  image: string; // URL
  salary: string;
  location: string;
  type: string; // "Doimiy", "Vaqtinchalik", etc.
  experience: string;
  deadline: string; // ISO date
  status: 'active' | 'closed';
  applicants: number;
  positions: number;
  category: 'it' | 'engineering' | 'hr' | 'marketing' | 'finance';
  employmentType: 'full-time' | 'part-time' | 'contract';
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

### GET /jobs
```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": { "uz": "Frontend dasturchi", "ru": "...", "en": "..." },
      "shortDescription": { "uz": "...", "ru": "...", "en": "..." },
      "image": "https://cdn.ung-youth.uz/jobs/1.jpg",
      "salary": "7,000,000 - 12,000,000 UZS",
      "location": "Toshkent",
      "experience": "2+ yil",
      "deadline": "2025-12-31T23:59:59Z",
      "status": "active",
      "applicants": 45,
      "positions": 3,
      "category": "it"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Query Parameters
```http
GET /jobs?page=1&limit=10&status=active&category=it&sort=-createdAt
```

### GET /jobs/:id
```json
// Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "title": { "uz": "Frontend dasturchi", "ru": "...", "en": "..." },
    "shortDescription": { "uz": "...", "ru": "...", "en": "..." },
    "content": { "uz": "<div>...</div>", "ru": "...", "en": "..." },
    "image": "https://cdn.ung-youth.uz/jobs/1.jpg",
    "salary": "7,000,000 - 12,000,000 UZS",
    "location": "Toshkent",
    "type": "Doimiy",
    "experience": "2+ yil",
    "deadline": "2025-12-31T23:59:59Z",
    "status": "active",
    "applicants": 45,
    "positions": 3,
    "category": "it",
    "employmentType": "full-time",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-10T12:00:00Z"
  }
}
```

### POST /jobs/:id/apply
```json
// Request
{
  "resume": "https://cdn.ung-youth.uz/resumes/user-1.pdf",
  "coverLetter": "I am interested in this position...",
  "phone": "+998901234567"
}

// Response (201)
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": 123,
    "jobId": 1,
    "userId": 5,
    "status": "pending",
    "appliedAt": "2025-11-24T10:30:00Z"
  }
}
```

---

## 🎓 Internships (Стажировки)

### Endpoints

```http
GET    /internships
GET    /internships/:id
POST   /internships
PUT    /internships/:id
DELETE /internships/:id
POST   /internships/:id/apply
```

### Data Structure

```typescript
interface Internship {
  id: number;
  title: { uz: string; ru: string; en: string };
  shortDescription: { uz: string; ru: string; en: string };
  content: { uz: string; ru: string; en: string };
  image: string;
  stipend: string;
  duration: string;
  deadline: string; // ISO date
  startDate: string; // ISO date
  status: 'active' | 'closed';
  applicants: number;
  positions: number;
  category: 'summer' | 'international' | 'technical';
  createdAt: string;
  updatedAt: string;
}
```

---

## 🏆 Competitions (Конкурсы)

### Endpoints

```http
GET    /competitions
GET    /competitions/:id
POST   /competitions
PUT    /competitions/:id
DELETE /competitions/:id
POST   /competitions/:id/register
```

### Data Structure

```typescript
interface Competition {
  id: number;
  title: { uz: string; ru: string; en: string };
  shortDescription: { uz: string; ru: string; en: string };
  content: { uz: string; ru: string; en: string };
  image: string;
  startDate: string;
  endDate: string;
  deadline: string;
  prize: string;
  participants: number;
  status: 'active' | 'upcoming' | 'closed';
  category: 'professional' | 'innovation' | 'sports' | 'social';
  createdAt: string;
  updatedAt: string;
}
```

---

## 💰 Grants (Гранты)

### Endpoints

```http
GET    /grants
GET    /grants/:id
POST   /grants
PUT    /grants/:id
DELETE /grants/:id
POST   /grants/:id/apply
```

### Data Structure

```typescript
interface Grant {
  id: number;
  title: { uz: string; ru: string; en: string };
  shortDescription: { uz: string; ru: string; en: string };
  content: { uz: string; ru: string; en: string };
  image: string;
  amount: string;
  duration: string;
  deadline: string;
  applicants: number;
  status: 'active' | 'closed';
  category: 'innovation' | 'ecology' | 'digital';
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎓 Scholarships (Стипендии)

### Endpoints

```http
GET    /scholarships
GET    /scholarships/:id
POST   /scholarships
PUT    /scholarships/:id
DELETE /scholarships/:id
POST   /scholarships/:id/apply
```

### Data Structure

```typescript
interface Scholarship {
  id: number;
  title: { uz: string; ru: string; en: string };
  shortDescription: { uz: string; ru: string; en: string };
  content: { uz: string; ru: string; en: string };
  image: string;
  amount: string;
  duration: string;
  deadline: string;
  recipients: number;
  status: 'active' | 'closed';
  category: 'master' | 'certification' | 'language';
  createdAt: string;
  updatedAt: string;
}
```

---

## 💡 Innovations (Инновации)

### Endpoints

```http
GET    /innovations
GET    /innovations/:id
POST   /innovations
PUT    /innovations/:id
DELETE /innovations/:id
POST   /innovations/:id/like
```

### Data Structure

```typescript
interface Innovation {
  id: number;
  title: { uz: string; ru: string; en: string };
  shortDescription: { uz: string; ru: string; en: string };
  content: { uz: string; ru: string; en: string };
  image: string;
  category: 'technology' | 'ecology' | 'automation' | 'digital';
  date: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 📰 News (Новости)

### Endpoints

```http
GET    /news
GET    /news/:id
POST   /news
PUT    /news/:id
DELETE /news/:id
POST   /news/:id/like
```

### Data Structure

```typescript
interface News {
  id: number;
  title: string;
  image: string;
  content: string; // HTML
  date: string;
  likes: number;
  views: number;
  author?: {
    id: number;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 👥 Team (Команда)

### Endpoints

```http
GET    /team
GET    /team/:id
POST   /team
PUT    /team/:id
DELETE /team/:id
```

### Data Structure

```typescript
interface TeamMember {
  id: number;
  name: string;
  position: { uz: string; ru: string; en: string };
  department: 'leadership' | 'innovation' | 'education' | 'media' | 'sports';
  image: string;
  bio?: { uz: string; ru: string; en: string };
  email?: string;
  phone?: string;
  social?: {
    linkedin?: string;
    telegram?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 💬 Comments (Комментарии)

### Endpoints

```http
GET    /comments?newsId=1
POST   /comments
PUT    /comments/:id
DELETE /comments/:id
POST   /comments/:id/like
POST   /comments/:id/dislike
```

### Data Structure

```typescript
interface Comment {
  id: number;
  newsId: number;
  userId?: number;
  author: string;
  content: string;
  likes: number;
  dislikes: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

### POST /comments
```json
// Request
{
  "newsId": 1,
  "content": "Great article!"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": 123,
    "newsId": 1,
    "author": "John Doe",
    "content": "Great article!",
    "likes": 0,
    "dislikes": 0,
    "date": "2025-11-24T10:30:00Z"
  }
}
```

---

## 📊 Statistics (Статистика)

### Endpoints

```http
GET    /stats/dashboard       # Общая статистика
GET    /stats/jobs            # Статистика по вакансиям
GET    /stats/internships     # Статистика по стажировкам
GET    /stats/users           # Статистика пользователей
```

### GET /stats/dashboard
```json
// Response (200)
{
  "success": true,
  "data": {
    "activeJobs": 15,
    "activeInternships": 8,
    "activeCompetitions": 5,
    "totalUsers": 1234,
    "totalApplications": 567,
    "recentActivities": [
      {
        "type": "job_application",
        "user": "John Doe",
        "job": "Frontend Developer",
        "timestamp": "2025-11-24T09:00:00Z"
      }
    ]
  }
}
```

---

## 🔍 Search (Поиск)

### Endpoint

```http
GET    /search?q=frontend&type=jobs&lang=uz
```

### Query Parameters
- `q` - поисковый запрос
- `type` - тип сущности (jobs, internships, news, etc.)
- `lang` - язык поиска (uz, ru, en)
- `limit` - количество результатов

### Response
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": 1,
        "type": "job",
        "title": "Frontend dasturchi",
        "snippet": "React va TypeScript bo'yicha tajribali...",
        "url": "/jobs/1",
        "relevance": 0.95
      }
    ],
    "total": 10,
    "query": "frontend",
    "executionTime": 45
  }
}
```

---

## 🚀 File Upload

### Endpoint

```http
POST   /upload
```

### Request (multipart/form-data)
```
file: [binary]
type: "resume" | "avatar" | "image"
```

### Response
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.ung-youth.uz/uploads/resume-123.pdf",
    "filename": "resume-123.pdf",
    "size": 1048576,
    "mimetype": "application/pdf"
  }
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Codes
```typescript
enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
  INTERNAL_ERROR = "INTERNAL_ERROR"
}
```

---

## 🔒 Authorization

### Headers
```http
Authorization: Bearer {accessToken}
```

### Roles
```typescript
enum Role {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator"
}
```

### Protected Routes
- Admin only: POST/PUT/DELETE для jobs, internships, etc.
- User: POST для apply, comment, like

---

## 📄 Pagination

### Standard Format
```http
GET /jobs?page=1&limit=10
```

### Response Meta
```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🔄 Sorting & Filtering

### Sort
```http
GET /jobs?sort=-createdAt,title  # desc by date, asc by title
```

### Filter
```http
GET /jobs?status=active&category=it&location=Toshkent
```

### Combined
```http
GET /jobs?status=active&category=it&sort=-deadline&page=1&limit=10
```

---

## 🛠️ Implementation Recommendations

### Backend Stack
- **Framework:** Node.js (Express/NestJS) или Python (FastAPI/Django)
- **Database:** PostgreSQL + Redis (cache)
- **ORM:** Prisma или TypeORM
- **File Storage:** AWS S3 или Minio
- **Auth:** JWT tokens
- **API Docs:** Swagger/OpenAPI

### Frontend Integration (Axios)
```javascript
// src/api/jobs.js
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getJobs = () => API.get('/jobs')
export const getJobById = (id) => API.get(`/jobs/${id}`)
export const applyToJob = (id, data) => API.post(`/jobs/${id}/apply`, data)
```

### React Query Integration
```javascript
import { useQuery } from '@tanstack/react-query'

function JobsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: getJobs
  })
  
  if (isLoading) return <Loader />
  if (error) return <Error message={error.message} />
  
  return <JobsGrid jobs={data.data} />
}
```

---

**Дата создания:** 24 ноября 2025  
**Версия:** 1.0

