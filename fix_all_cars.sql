-- Обновление всех описаний автомобилей по брендам
UPDATE cars SET description = 'Японский спортивный автомобиль' WHERE country = 'Japan';
UPDATE cars SET description = 'Немецкий спортивный автомобиль' WHERE country = 'Germany';
UPDATE cars SET description = 'Американский спортивный автомобиль' WHERE country = 'USA';
UPDATE cars SET description = 'Чешский автомобиль' WHERE country = 'Czech';
UPDATE cars SET description = 'Корейский автомобиль' WHERE country = 'Korea';

-- Обновление мощности
UPDATE cars SET power = '200 л.с.' WHERE power IS NULL OR power = '';
UPDATE cars SET torque = '300 Нм' WHERE torque IS NULL OR torque = '';
UPDATE cars SET acceleration = '6.0 сек' WHERE acceleration IS NULL OR acceleration = '';
UPDATE cars SET "topSpeed" = '220 км/ч' WHERE "topSpeed" IS NULL OR "topSpeed" = '';

-- Конкретные обновления для известных моделей
UPDATE cars SET description = 'Легендарный японский хэтчбек с двигателем B16B' WHERE brand = 'Honda' AND model = 'Civic EK9';
UPDATE cars SET description = 'Классический BMW 3-й серии, легенда автоспорта' WHERE brand = 'BMW' AND model = 'E30 (3 Series)';
UPDATE cars SET description = 'Популярный немецкий хэтчбек с турбонаддувом' WHERE brand = 'Volkswagen' AND model = 'Golf IV GTI';
UPDATE cars SET description = 'Чешский седан с надежным двигателем' WHERE brand = 'Skoda' AND model = 'Octavia A5';
UPDATE cars SET description = 'Современный чешский седан с улучшенными характеристиками' WHERE brand = 'Skoda' AND model = 'Octavia A7';
UPDATE cars SET description = 'Корейский седан с надежным двигателем' WHERE brand = 'Hyundai' AND model = 'Solaris';
UPDATE cars SET description = 'Корейский седан с современным дизайном' WHERE brand = 'Kia' AND model = 'Rio';

-- Обновление мощности для конкретных моделей
UPDATE cars SET power = '185 л.с.' WHERE brand = 'Honda' AND model = 'Civic EK9';
UPDATE cars SET power = '170 л.с.' WHERE brand = 'BMW' AND model = 'E30 (3 Series)';
UPDATE cars SET power = '150 л.с.' WHERE brand = 'Volkswagen' AND model = 'Golf IV GTI';
UPDATE cars SET power = '150 л.с.' WHERE brand = 'Skoda' AND model = 'Octavia A5';
UPDATE cars SET power = '190 л.с.' WHERE brand = 'Skoda' AND model = 'Octavia A7';
UPDATE cars SET power = '123 л.с.' WHERE brand = 'Hyundai' AND model = 'Solaris';
UPDATE cars SET power = '123 л.с.' WHERE brand = 'Kia' AND model = 'Rio';

-- Обновление крутящего момента
UPDATE cars SET torque = '160 Нм' WHERE brand = 'Honda' AND model = 'Civic EK9';
UPDATE cars SET torque = '220 Нм' WHERE brand = 'BMW' AND model = 'E30 (3 Series)';
UPDATE cars SET torque = '210 Нм' WHERE brand = 'Volkswagen' AND model = 'Golf IV GTI';
UPDATE cars SET torque = '250 Нм' WHERE brand = 'Skoda' AND model = 'Octavia A5';
UPDATE cars SET torque = '320 Нм' WHERE brand = 'Skoda' AND model = 'Octavia A7';
UPDATE cars SET torque = '155 Нм' WHERE brand = 'Hyundai' AND model = 'Solaris';
UPDATE cars SET torque = '155 Нм' WHERE brand = 'Kia' AND model = 'Rio';

-- Обновление разгона
UPDATE cars SET acceleration = '6.2 сек' WHERE brand = 'Honda' AND model = 'Civic EK9';
UPDATE cars SET acceleration = '7.8 сек' WHERE brand = 'BMW' AND model = 'E30 (3 Series)';
UPDATE cars SET acceleration = '8.5 сек' WHERE brand = 'Volkswagen' AND model = 'Golf IV GTI';
UPDATE cars SET acceleration = '8.5 сек' WHERE brand = 'Skoda' AND model = 'Octavia A5';
UPDATE cars SET acceleration = '7.2 сек' WHERE brand = 'Skoda' AND model = 'Octavia A7';
UPDATE cars SET acceleration = '10.5 сек' WHERE brand = 'Hyundai' AND model = 'Solaris';
UPDATE cars SET acceleration = '10.5 сек' WHERE brand = 'Kia' AND model = 'Rio';

-- Обновление максимальной скорости
UPDATE cars SET "topSpeed" = '230 км/ч' WHERE brand = 'Honda' AND model = 'Civic EK9';
UPDATE cars SET "topSpeed" = '220 км/ч' WHERE brand = 'BMW' AND model = 'E30 (3 Series)';
UPDATE cars SET "topSpeed" = '216 км/ч' WHERE brand = 'Volkswagen' AND model = 'Golf IV GTI';
UPDATE cars SET "topSpeed" = '210 км/ч' WHERE brand = 'Skoda' AND model = 'Octavia A5';
UPDATE cars SET "topSpeed" = '240 км/ч' WHERE brand = 'Skoda' AND model = 'Octavia A7';
UPDATE cars SET "topSpeed" = '190 км/ч' WHERE brand = 'Hyundai' AND model = 'Solaris';
UPDATE cars SET "topSpeed" = '190 км/ч' WHERE brand = 'Kia' AND model = 'Rio';
