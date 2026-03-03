# UNG Youth Platform

Full-stack web platform for youth management. Includes a public-facing frontend, admin dashboard, and Django REST API backend.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Django 5.2 + DRF, PostgreSQL 17 |
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Dashboard | React 18 + TypeScript, Vite, Tailwind CSS v4 |
| Auth | Token-based (custom expiring tokens) |
| i18n | UZ / RU / EN |

---

## Project Structure

```
youth_ung/
├── backend/        # Django REST API (port 8000)
├── frontend/       # Public-facing React app (port 5173)
├── dashboard/      # Admin panel React + TypeScript (port 5174)
└── docs/           # Project documentation
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 17 (or Docker)

---

## Backend Setup

### 1. Create and activate virtual environment

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create `backend/.env`:

```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

POSTGRES_DB=youth_database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
HOST=localhost
POSTGRES_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 4. Run database migrations

```bash
cd backend
python manage.py migrate
```

### 5. Collect static files

```bash
python manage.py collectstatic --noinput
```

### 6. Create superuser

```bash
python manage.py createsuperuser
```

### 7. Populate test data (optional)

```bash
python create_test_data.py
```

### 8. Start development server

```bash
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

| URL | Description |
|---|---|
| `http://localhost:8000/admin/` | Django admin panel |
| `http://localhost:8000/api/v1/` | REST API base |
| `http://localhost:8000/swagger/` | Swagger UI |
| `http://localhost:8000/redoc/` | ReDoc API docs |

---

## Backend — Docker Setup

### Start all services (database + API)

```bash
cd backend
docker compose up --build
```

### Start in background

```bash
docker compose up -d --build
```

### Run migrations inside container

```bash
docker compose exec web python manage.py migrate
```

### Create superuser inside container

```bash
docker compose exec web python manage.py createsuperuser
```

### Stop containers

```bash
docker compose down
```

### Stop and remove volumes (reset database)

```bash
docker compose down -v
```

---

## Frontend Setup (Public Site)

```bash
cd frontend
npm install
```

### Configure environment (optional)

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Start development server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Dashboard Setup (Admin Panel)

```bash
cd dashboard
npm install
```

### Configure environment

Create `dashboard/.env`:

```env
VITE_API_URL=http://localhost:8000
```

### Start development server

```bash
npm run dev
```

Dashboard runs at: `http://localhost:5174`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Type check + build

```bash
npm run build   # runs: tsc -b && vite build
```

### Lint

```bash
npm run lint
```

---

## Running Everything at Once

Open three terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
.venv\Scripts\activate     # Windows
source .venv/bin/activate  # Linux/macOS
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 — Dashboard:**
```bash
cd dashboard
npm run dev
```

---

## API Overview

Base URL: `http://localhost:8000/api/v1/`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/sign-in/` | Login (returns token) |
| POST | `/users/sign-up/` | Register |
| GET | `/users/profile/` | Get current user |
| PATCH | `/users/profile/` | Update profile |

All authenticated requests require the header:
```
Authorization: Token <your_token>
```

### Content Endpoints (public)

| Endpoint | Description |
|---|---|
| `/news/` | News |
| `/grants/` | Grants |
| `/scholarships/` | Scholarships |
| `/competitions/` | Competitions |
| `/innovations/` | Innovations |
| `/internships/` | Internships |
| `/jobs/` | Jobs |
| `/team/` | Team members |
| `/articles/` | Articles |
| `/technologies/` | Technologies |
| `/projects/` | Projects |
| `/research/` | Research |
| `/statistics/` | Youth statistics |

### Admin Endpoints

| Endpoint | Description |
|---|---|
| `/admin/` | Full CRUD for all content |
| `/admin/admins/` | Administrator management |
| `/admin/all-users/` | All registered users |
| `/admin/analytics/dashboard/` | Analytics stats |

---

## User Roles

| Role | Access |
|---|---|
| `Admin` | Full access to all sections |
| `Moderator` | Access to assigned menu sections |
| `Coordinator` | Access to users section only |
| `User` | Public frontend only |

---

## Security Notes

- Rate limiting: 5 login attempts per minute per IP
- Minimum password length: 12 characters
- Tokens expire automatically (configured in `Token` model)
- CORS restricted to configured origins
- In production, set `DEBUG=False` and configure all `SECURE_*` settings

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | — | Django secret key (required in production) |
| `DEBUG` | `False` | Enable debug mode |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated allowed hosts |
| `POSTGRES_DB` | `youth_database` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | — | Database password |
| `HOST` | `host.docker.internal` | Database host |
| `POSTGRES_PORT` | `5432` | Database port |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Allowed CORS origins |
| `CSRF_TRUSTED_ORIGINS` | `http://localhost:5173,...` | Trusted CSRF origins |

### Frontend & Dashboard (`.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |
