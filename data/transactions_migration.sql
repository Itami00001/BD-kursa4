-- Таблица для хранения транзакций COIN между пользователями
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    recipient_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_recipient ON transactions(recipient_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
