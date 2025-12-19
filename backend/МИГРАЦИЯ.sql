-- ВЫПОЛНИ ЭТОТ SQL В БАЗЕ ДАННЫХ!
-- Через Docker Desktop: Containers -> postgres -> Exec -> psql -U postgres -d youth_db

-- 1. Добавить category к TeamMember (если еще нет)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='content_team_members' AND column_name='category'
    ) THEN
        ALTER TABLE content_team_members 
        ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'leadership';
    END IF;
END $$;

-- 2. Создать таблицу Technologies
CREATE TABLE IF NOT EXISTS content_technologies (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    short_description_uz TEXT NOT NULL,
    short_description_ru TEXT NOT NULL,
    short_description_en TEXT NOT NULL,
    image VARCHAR(255),
    category VARCHAR(50) NOT NULL DEFAULT 'artificial_intelligence',
    date DATE NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    content_uz TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by_id INTEGER,
    updated_by_id INTEGER
);

-- 3. Создать таблицу Projects
CREATE TABLE IF NOT EXISTS content_projects (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    short_description_uz TEXT NOT NULL,
    short_description_ru TEXT NOT NULL,
    short_description_en TEXT NOT NULL,
    image VARCHAR(255),
    content_uz TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    budget VARCHAR(100),
    duration VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'planning',
    progress INTEGER NOT NULL DEFAULT 0,
    team_size INTEGER,
    location_uz VARCHAR(255),
    location_ru VARCHAR(255),
    location_en VARCHAR(255),
    category VARCHAR(50) NOT NULL DEFAULT 'infrastructure',
    start_date DATE,
    end_date DATE,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by_id INTEGER,
    updated_by_id INTEGER
);

-- 4. Создать таблицу Research
CREATE TABLE IF NOT EXISTS content_research (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    short_description_uz TEXT NOT NULL,
    short_description_ru TEXT NOT NULL,
    short_description_en TEXT NOT NULL,
    image VARCHAR(255),
    content_uz TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    authors TEXT,
    department_uz VARCHAR(255),
    department_ru VARCHAR(255),
    department_en VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ongoing',
    category VARCHAR(50) NOT NULL DEFAULT 'fundamental',
    publications TEXT,
    citations INTEGER,
    budget VARCHAR(100),
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by_id INTEGER,
    updated_by_id INTEGER
);

-- 5. Создать таблицу Results
CREATE TABLE IF NOT EXISTS content_results (
    id SERIAL PRIMARY KEY,
    title_uz VARCHAR(255) NOT NULL,
    title_ru VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    short_description_uz TEXT NOT NULL,
    short_description_ru TEXT NOT NULL,
    short_description_en TEXT NOT NULL,
    image VARCHAR(255),
    content_uz TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    content_en TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'education',
    status VARCHAR(50) NOT NULL DEFAULT 'achieved',
    year INTEGER NOT NULL,
    metrics_uz TEXT,
    metrics_ru TEXT,
    metrics_en TEXT,
    achievements_uz TEXT,
    achievements_ru TEXT,
    achievements_en TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by_id INTEGER,
    updated_by_id INTEGER
);

-- 6. Записать миграции в django_migrations
INSERT INTO django_migrations (app, name, applied) 
VALUES ('content', '0011_teammember_category', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO django_migrations (app, name, applied) 
VALUES ('content', '0012_add_technologies_projects_research_results', NOW())
ON CONFLICT DO NOTHING;

-- ГОТОВО!
SELECT 'Миграции применены успешно!' as status;

