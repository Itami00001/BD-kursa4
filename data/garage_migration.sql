-- Миграция для таблицы user_garage (Вариант 1: JSONB)
-- Запускать внутри контейнера: docker-compose exec postgresdb psql -U postgres -d tunning_manual_db -f /tmp/garage_migration.sql

BEGIN;
SET client_encoding = 'UTF8';

-- Таблица гаража пользователя (без FOREIGN KEY для совместимости)
CREATE TABLE IF NOT EXISTS user_garage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- временно без REFERENCES customers(id)
    car_id INTEGER NOT NULL,  -- временно без REFERENCES cars(id)
    name VARCHAR(100) DEFAULT 'Моя конфигурация', -- название конфигурации
    parts JSONB DEFAULT '[]', -- [{partId, name, category, powerGain, torqueGain, compatibilityScore, installDifficulty, addedAt}]
    stats JSONB DEFAULT '{}', -- {totalPowerGain, totalTorqueGain, avgCompatibility, totalInstallDifficulty}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id) -- один пользователь = один гараж
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_user_garage_user_id ON user_garage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_garage_car_id ON user_garage(car_id);

COMMENT ON TABLE user_garage IS 'Гараж пользователя: одна машина + набор деталей в JSONB';
COMMENT ON COLUMN user_garage.parts IS 'JSONB массив установленных деталей с их характеристиками';
COMMENT ON COLUMN user_garage.stats IS 'Агрегированные статы для быстрого отображения радара';

COMMIT;
