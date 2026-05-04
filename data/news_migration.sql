-- Migration: Create news table for the news system
-- Users can create news by uploading .md files and paying with COIN

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    author_id INTEGER REFERENCES customers(id),
    style VARCHAR(20) DEFAULT 'classic', -- 'classic' or 'premium'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_style ON news(style);
CREATE INDEX IF NOT EXISTS idx_news_created ON news(created_at DESC);

-- Table for tracking news payments/transactions
CREATE TABLE IF NOT EXISTS news_payments (
    id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES customers(id),
    amount INTEGER NOT NULL, -- Total COIN paid
    base_cost INTEGER DEFAULT 1000, -- Base cost 1000 COIN
    style_cost INTEGER DEFAULT 0, -- Additional cost for style (500 classic, 1500 premium)
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample news
INSERT INTO news (title, content, author, style, status, views) VALUES
('Добро пожаловать в Tunning Manual 8080!', 
 '# Добро пожаловать!\n\nЭто первая новость в системе. Здесь будут публиковаться важные обновления и анонсы.\n\n## Что нового?\n- Система тюнинга автомобилей\n- Новости и обновления\n- COIN валюта для покупок\n\n**Присоединяйтесь к нам!**', 
 'admin', 'premium', 'active', 150),

('Новая система COIN', 
 '# Система COIN\n\nТеперь у нас есть внутренняя валюта!\n\n- Зарабатывайте COIN за активность\n- Покупайте новости\n- Оформляйте premium размещение\n\n*Classic оформление: 500 COIN*\n*Premium оформление: 1500 COIN*', 
 'admin', 'classic', 'active', 75);
