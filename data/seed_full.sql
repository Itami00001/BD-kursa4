BEGIN;
SET client_encoding = 'UTF8';

-- Apply in this order
\i 'data/schema.sql'
\i 'data/seed_users.sql'
\i 'data/seed_cars.sql'
\i 'data/seed_parts_compatibility.sql'

COMMIT;
