-- Создание базы данных для системы тюнинга автомобилей
-- Tunning Manual 8080

-- Таблица: Категории деталей
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Таблица: Производители
CREATE TABLE IF NOT EXISTS manufacturers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Таблица: Автомобили (расширенная)
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    country VARCHAR(50) NOT NULL DEFAULT 'unknown',
    description TEXT,
    image VARCHAR(10) DEFAULT '🚗',
    power VARCHAR(50),
    torque VARCHAR(50),
    acceleration VARCHAR(50),
    "topSpeed" VARCHAR(50),
    "compatibilityRating" DECIMAL(3, 1) DEFAULT 0
);

-- Таблица: Детали (расширенная)
CREATE TABLE IF NOT EXISTS parts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    categoryId INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    manufacturerId INTEGER REFERENCES manufacturers(id) ON DELETE CASCADE,
    "powerGain" INTEGER DEFAULT 0,
    "torqueGain" INTEGER DEFAULT 0,
    "compatibilityScore" INTEGER DEFAULT 5,
    "installDifficulty" INTEGER DEFAULT 5,
    instruction TEXT
);

-- Таблица: Совместимость
CREATE TABLE IF NOT EXISTS compatibility (
    id SERIAL PRIMARY KEY,
    carId INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    partId INTEGER REFERENCES parts(id) ON DELETE CASCADE,
    note TEXT
);

-- Таблица: Клиенты
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Таблица: Акции
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    discount DECIMAL(5, 2) NOT NULL
);

-- Таблица: Заказы
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    amount DECIMAL(10, 2) NOT NULL,
    customerId INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    promotionId INTEGER REFERENCES promotions(id) ON DELETE SET NULL
);

-- Таблица: Отзывы
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    customerId INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    partId INTEGER REFERENCES parts(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    text TEXT,
    date DATE DEFAULT CURRENT_DATE
);

-- Таблица: Услуги установки
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    durationMinutes INTEGER NOT NULL
);

-- Таблица: Записи на услуги
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    customerId INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    serviceId INTEGER REFERENCES services(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL
);

-- Таблица: Администраторы
CREATE TABLE IF NOT EXISTS administrators (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Таблица: Настройки системы
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    "key" VARCHAR(100) NOT NULL,
    value VARCHAR(255) NOT NULL,
    administratorId INTEGER REFERENCES administrators(id) ON DELETE CASCADE
);

-- ============================================================
-- ВСТАВКА ДАННЫХ
-- ============================================================

-- Категории деталей (расширенные)
INSERT INTO categories (name) VALUES
('Двигатель и выхлоп'),
('Подвеска и тормоза'),
('Кузов и экстерьер'),
('Салон и интерьер'),
('Электроника'),
('Колеса и шины'),
('Турбины'),
('Выхлопные системы'),
('Впускные системы'),
('Чип-тюнинг'),
('Топливная система'),
('Тормозные системы');

-- Производители
INSERT INTO manufacturers (name) VALUES
('Brembo'),
('Borla'),
('HKS'),
('KW'),
('Recaro'),
('Pirelli'),
('Bosch'),
('Volkswagen'),
('Quantum Racing'),
('Garrett'),
('GReddy'),
('Neuspeed'),
('Milltek'),
('Eibach'),
('BC Racing'),
('APR'),
('RacingLine'),
('Haltech');

-- ============================================================
-- АВТОМОБИЛИ (все 12 из configurations.js)
-- ============================================================

INSERT INTO cars (brand, model, year, country, description, image, power, torque, acceleration, "topSpeed", "compatibilityRating") VALUES
-- Япония (id 1-6)
('Nissan', 'Skyline R34', 1999, 'japan', 'Легендарный спорткар с двигателем RB26DETT', '🚗', '280 л.с.', '368 Нм', '5.2 сек до 100 км/ч', '250 км/ч', 9.8),
('Nissan', 'Silvia S14', 1997, 'japan', 'Классический дрифт-кар с двигателем SR20DET', '🚙', '220 л.с.', '275 Нм', '6.5 сек до 100 км/ч', '235 км/ч', 9.5),
('Nissan', 'Silvia S15', 2002, 'japan', 'Последнее поколение Silvia с улучшенной аэродинамикой', '🚕', '250 л.с.', '300 Нм', '5.8 сек до 100 км/ч', '245 км/ч', 9.6),
('Mazda', 'RX-7 FD3S', 2002, 'japan', 'Иконический роторный спорткар', '🏎️', '280 л.с.', '343 Нм', '5.0 сек до 100 км/ч', '250 км/ч', 9.2),
('Toyota', 'Supra A80', 1998, 'japan', 'Легендарный тюнинг-кар с двигателем 2JZ-GTE', '🚗', '280 л.с.', '432 Нм', '4.9 сек до 100 км/ч', '250 км/ч', 9.9),
('Honda', 'Civic EK9', 2000, 'japan', 'Горячий хэтчбек с двигателем B16B', '🚙', '185 л.с.', '160 Нм', '6.2 сек до 100 км/ч', '225 км/ч', 8.9),
-- Германия (id 7-8)
('BMW', 'E30 (3 Series)', 1988, 'germany', 'Классический BMW 1982-1994 годов, идеальная база для тюнинга', '🚗', '170 л.с.', '220 Нм', '8.1 сек до 100 км/ч', '210 км/ч', 9.4),
('Volkswagen', 'Golf IV GTI', 2002, 'germany', 'Компактный хэтчбек с турбированным двигателем', '🚕', '150 л.с.', '210 Нм', '8.5 сек до 100 км/ч', '208 км/ч', 8.7),
-- Чехия (id 9-11)
('Skoda', 'Octavia A5', 2020, 'czech', 'Современный семейный седан с чешским качеством', '🚙', '150 л.с.', '250 Нм', '8.7 сек до 100 км/ч', '220 км/ч', 8.3),
('Skoda', 'Octavia A7', 2023, 'czech', 'Последнее поколение Octavia с современным дизайном', '🚗', '190 л.с.', '320 Нм', '7.4 сек до 100 км/ч', '240 км/ч', 8.5),
('Skoda', 'Rapid', 2022, 'czech', 'Компактный лифтбэк с отличным соотношением цены/качества', '🚕', '95 л.с.', '175 Нм', '11.2 сек до 100 км/ч', '185 км/ч', 7.8),
-- Америка (id 12)
('Ford', 'Mustang GT', 2022, 'america', 'Американский маслкар с V8 двигателем', '🏎️', '450 л.с.', '529 Нм', '4.3 сек до 100 км/ч', '260 км/ч', 8.9);

-- ============================================================
-- ДЕТАЛИ (из jdm-parts.json, europe-parts.json, czech-parts.json)
-- ============================================================

INSERT INTO parts (name, price, categoryId, manufacturerId, "powerGain", "torqueGain", "compatibilityScore", "installDifficulty", instruction) VALUES
-- JDM Parts (id 1-6)
('Turbo Quantum Racing GT2871 для SR20DET (Nissan Silvia S14)', 21000.00, 7, 9, 90, 100, 10, 3, 'Установить турбину в штатное место, подключить интеркулер, выхлоп и усиленный топливный насос, выполнить перепрошивку ЭБУ.'),
('Turbo Garrett GT35R для RB26DETT (Nissan Skyline R34)', 35000.00, 7, 10, 120, 150, 9, 4, 'Установить турбину, модернизировать систему охлаждения, усилить топливную систему, настроить ЭБУ.'),
('Turbo HKS GT2540 для SR20DET (Nissan Silvia S15)', 28000.00, 7, 3, 80, 90, 10, 3, 'Установить турбину HKS, подключить интеркулер и выхлопную систему.'),
('Turbo Kit HKS для 2JZ-GTE (Toyota Supra A80)', 85000.00, 7, 3, 200, 250, 9, 6, 'Полная замена турбосистемы с установкой интеркулера и выхлопа.'),
('Cold Air Intake Icebox для B16B (Honda Civic EK9)', 8000.00, 9, 3, 8, 10, 9, 1, 'Установить холодный впуск в штатное место.'),
('Turbo HKS T04R для 13B-REW (Mazda RX-7 FD3S)', 45000.00, 7, 3, 100, 120, 8, 5, 'Установить турбину HKS, модернизировать систему охлаждения.'),

-- Europe Parts (id 7-12)
('Комплект подвески HR Sport для BMW E30', 45000.00, 2, 4, 0, 0, 10, 4, 'Установить амортизаторы и пружины, выполнить развал-схождение.'),
('Турбо-кит для M50/M52 (BMW E30)', 95000.00, 7, 10, 120, 150, 6, 8, 'Установить турбину, интеркулер, усилить топливную систему.'),
('Турбо-кит для 1.8T (Volkswagen Golf IV GTI)', 55000.00, 7, 10, 60, 80, 9, 5, 'Установить турбо-кит, выполнить прошивку ЭБУ.'),
('Чип-тюнинг для 2.0 TDI (Skoda Octavia A5)', 15000.00, 10, 16, 30, 50, 10, 1, 'Выполнить прошивку ЭБУ для увеличения мощности.'),
('Чип-тюнинг для 2.0 TSI (Skoda Octavia A7)', 18000.00, 10, 16, 35, 60, 10, 1, 'Выполнить прошивку ЭБУ для оптимизации мощности.'),
('Чип-тюнинг для 1.0 TSI (Skoda Rapid)', 12000.00, 10, 16, 20, 30, 10, 1, 'Выполнить прошивку ЭБУ для увеличения мощности.'),

-- Czech Parts (id 13-21)
('Комплект подвески KW Variant 3 для Octavia A5/A7', 65000.00, 2, 4, 0, 0, 9, 5, 'Установить амортизаторы и пружины KW, выполнить развал-схождение.'),
('Комплект подвески Eibach Pro-Kit для Skoda Rapid', 25000.00, 2, 14, 0, 0, 8, 3, 'Установить занижающие пружины Eibach.'),
('Выхлопная система Milltek для Octavia A5/A7', 35000.00, 8, 13, 15, 25, 9, 3, 'Установить выхлопную систему Milltek Sport.'),
('Выхлопная система Borla для Skoda Rapid', 28000.00, 8, 2, 12, 20, 8, 3, 'Установить выхлопную систему Borla.'),
('Холодный впуск Neuspeed для Octavia A5/A7', 12000.00, 9, 12, 8, 12, 9, 2, 'Установить холодный впуск Neuspeed.'),
('Тормозная система Brembo для Skoda Rapid', 45000.00, 12, 1, 0, 0, 8, 4, 'Установить тормозные суппорты и диски Brembo.');

-- ============================================================
-- СОВМЕСТИМОСТЬ (car_id ↔ part_id)
-- ============================================================

INSERT INTO compatibility (carId, partId, note) VALUES
-- Nissan Silvia S14 (car 2) ↔ parts
(2, 1, 'Полная совместимость (Plug&Play). Турбина для SR20DET S14.'),
-- Nissan Skyline R34 (car 1) ↔ parts
(1, 2, 'Турбина Garrett для RB26DETT R34.'),
-- Nissan Silvia S15 (car 3) ↔ parts
(3, 3, 'Турбина HKS для SR20DET S15.'),
-- Toyota Supra A80 (car 5) ↔ parts
(5, 4, 'Турбо-кит HKS для 2JZ-GTE Supra A80.'),
-- Honda Civic EK9 (car 6) ↔ parts
(6, 5, 'Cold Air Intake для B16B Civic EK9.'),
-- Mazda RX-7 FD3S (car 4) ↔ parts
(4, 6, 'Турбина HKS T04R для 13B-REW RX-7 FD3S.'),
-- BMW E30 (car 7) ↔ parts
(7, 7, 'Комплект подвески HR Sport для BMW E30.'),
(7, 8, 'Турбо-кит для M50/M52 BMW E30.'),
-- VW Golf IV GTI (car 8) ↔ parts
(8, 9, 'Турбо-кит для 1.8T Golf IV GTI.'),
-- Skoda Octavia A5 (car 9) ↔ parts
(9, 10, 'Чип-тюнинг для 2.0 TDI Octavia A5.'),
(9, 13, 'Подвеска KW Variant 3 для Octavia A5.'),
(9, 15, 'Выхлоп Milltek для Octavia A5.'),
(9, 17, 'Холодный впуск Neuspeed для Octavia A5.'),
-- Skoda Octavia A7 (car 10) ↔ parts
(10, 11, 'Чип-тюнинг для 2.0 TSI Octavia A7.'),
(10, 13, 'Подвеска KW Variant 3 для Octavia A7.'),
(10, 15, 'Выхлоп Milltek для Octavia A7.'),
(10, 17, 'Холодный впуск Neuspeed для Octavia A7.'),
-- Skoda Rapid (car 11) ↔ parts
(11, 12, 'Чип-тюнинг для 1.0 TSI Rapid.'),
(11, 14, 'Подвеска Eibach Pro-Kit для Rapid.'),
(11, 16, 'Выхлоп Borla для Rapid.'),
(11, 18, 'Тормозная система Brembo для Rapid.'),
-- Ford Mustang GT (car 12) - has no specific parts yet, общие
(12, 7, 'Подвеска HR Sport - совместимость ограничена, требует адаптеров.');

-- ============================================================
-- ОСТАЛЬНЫЕ ТЕСТОВЫЕ ДАННЫЕ
-- ============================================================

-- Клиенты
INSERT INTO customers (fullName, phone, email) VALUES
('Иванов Иван Иванович', '+7-900-123-4567', 'ivanov@example.com'),
('Петров Петр Петрович', '+7-900-234-5678', 'petrov@example.com'),
('Сидоров Сидор Сидорович', '+7-900-345-6789', 'sidorov@example.com'),
('Алексеев Алексей Алексеевич', '+7-900-456-7890', 'alekseev@example.com');

-- Акции
INSERT INTO promotions (name, description, discount) VALUES
('Летняя распродажа', 'Скидка на все тормозные системы', 15.00),
('Зимнее предложение', 'Скидка на шины и диски', 20.00),
('Black Friday', 'Скидка на все детали 25%', 25.00);

-- Заказы
INSERT INTO orders (date, amount, customerId, promotionId) VALUES
('2024-01-15', 45000.00, 1, 1),
('2024-01-20', 95000.00, 2, 3),
('2024-02-01', 35000.00, 3, NULL),
('2024-02-15', 120000.00, 4, 2);

-- Отзывы
INSERT INTO reviews (customerId, partId, rating, text, date) VALUES
(1, 1, 9, 'Отличная турбина, установка прошла без проблем', '2024-01-20'),
(2, 2, 10, 'Идеальная турбина для R34, машина стала зверем', '2024-01-25'),
(3, 7, 8, 'Хорошая подвеска, но установка была сложной', '2024-02-05'),
(4, 10, 10, 'Супер чип-тюнинг, мощность заметно выросла', '2024-02-20');

-- Услуги установки
INSERT INTO services (name, price, durationMinutes) VALUES
('Установка тормозной системы', 5000.00, 180),
('Установка выхлопной системы', 4000.00, 120),
('Установка подвески', 8000.00, 240),
('Установка турбины', 15000.00, 360),
('Диагностика двигателя', 3000.00, 90),
('Чип-тюнинг / прошивка ЭБУ', 5000.00, 120);

-- Записи на услуги
INSERT INTO appointments (date, time, customerId, serviceId, status) VALUES
('2024-03-01', '10:00:00', 1, 4, 'запланирована'),
('2024-03-02', '14:00:00', 2, 3, 'запланирована'),
('2024-03-03', '09:00:00', 3, 2, 'завершена'),
('2024-03-04', '11:00:00', 4, 6, 'запланирована');

-- Администраторы
INSERT INTO administrators (login, password) VALUES
('admin', 'adminadmin'),
('test', 'testtest');

-- Настройки системы
INSERT INTO system_settings ("key", value, administratorId) VALUES
('site_name', 'Tunning Manual 8080', 1),
('max_file_size', '10MB', 1),
('maintenance_mode', 'false', 2),
('currency', 'RUB', 1);

-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(categoryId);
CREATE INDEX IF NOT EXISTS idx_parts_manufacturer ON parts(manufacturerId);
CREATE INDEX IF NOT EXISTS idx_compatibility_car ON compatibility(carId);
CREATE INDEX IF NOT EXISTS idx_compatibility_part ON compatibility(partId);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customerId);
CREATE INDEX IF NOT EXISTS idx_orders_promotion ON orders(promotionId);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customerId);
CREATE INDEX IF NOT EXISTS idx_reviews_part ON reviews(partId);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customerId);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(serviceId);
CREATE INDEX IF NOT EXISTS idx_cars_country ON cars(country);

-- Дополнительные индексы для конкурентных операций и оптимизации
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status_created ON orders(status, "createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_category_manufacturer ON parts(categoryId, manufacturerId);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_brand_model ON cars(brand, model);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compatibility_score ON compatibility("compatibilityScore");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_compatibility_difficulty ON compatibility("installDifficulty");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_price ON parts(price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_amount ON orders(amount);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_date ON appointments("appointmentDate");

-- Композитные индексы для сложных запросов
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_composite_car_parts ON compatibility(carId, partId);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_composite_category_price ON parts(categoryId, price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_composite_manufacturer_price ON parts(manufacturerId, price);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_composite_country_year ON cars(country, year);

-- Индексы для поиска и фильтрации
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_parts_name_search ON parts USING gin(to_tsvector('english', "name"));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_brand_search ON cars USING gin(to_tsvector('english', brand));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cars_model_search ON cars USING gin(to_tsvector('english', model));
