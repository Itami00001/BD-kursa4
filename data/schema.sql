BEGIN;
SET client_encoding = 'UTF8';

-- Ensure required unique constraints / indexes for stable seeds
CREATE UNIQUE INDEX IF NOT EXISTS ux_categories_name ON categories(name);
CREATE UNIQUE INDEX IF NOT EXISTS ux_manufacturers_name ON manufacturers(name);

-- Optional: prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS ux_customers_email ON customers(email);

COMMIT;
