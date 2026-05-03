BEGIN;
SET client_encoding = 'UTF8';

-- customers (users)
TRUNCATE TABLE customers RESTART IDENTITY CASCADE;

-- Minimal стартовые пользователи
INSERT INTO customers (fullName, phone, email) VALUES
  ('Admin', NULL, 'admin@local'),
  ('User One', NULL, 'user1@local'),
  ('User Two', NULL, 'user2@local');

COMMIT;
