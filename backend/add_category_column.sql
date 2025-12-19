-- Миграция для добавления поля category в таблицу content_team_members

-- Проверяем, существует ли уже колонка (для безопасности)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='content_team_members' AND column_name='category'
    ) THEN
        -- Добавляем колонку category
        ALTER TABLE content_team_members 
        ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'leadership';
        
        -- Добавляем constraint для проверки допустимых значений
        ALTER TABLE content_team_members 
        ADD CONSTRAINT content_team_members_category_check 
        CHECK (category IN ('leadership', 'innovation', 'education', 'media', 'sports'));
        
        -- Записываем миграцию в таблицу django_migrations
        INSERT INTO django_migrations (app, name, applied)
        VALUES ('content', '0011_teammember_category', NOW());
        
        RAISE NOTICE 'Колонка category успешно добавлена!';
    ELSE
        RAISE NOTICE 'Колонка category уже существует!';
    END IF;
END $$;

