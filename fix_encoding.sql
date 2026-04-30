-- Обновление описаний автомобилей с правильной кодировкой
UPDATE cars SET description = 'Легендарный японский спорткар с двигателем RB26DETT' WHERE brand = 'Nissan' AND model = 'Skyline R34';
UPDATE cars SET description = 'Классический японский дрифт-кар с двигателем SR20DET' WHERE brand = 'Nissan' AND model = 'Silvia S14';
UPDATE cars SET description = 'Современный японский спорткар с улучшенной подвеской' WHERE brand = 'Nissan' AND model = 'Silvia S15';
UPDATE cars SET description = 'Легендарный роторный спорткар Mazda' WHERE brand = 'Mazda' AND model = 'RX-7 FD3S';
UPDATE cars SET description = 'Легендарный японский спорткар с двигателем 2JZ-GTE' WHERE brand = 'Toyota' AND model = 'Supra A80';
UPDATE cars SET description = 'Современный японский спорткар с турбонаддувом' WHERE brand = 'Toyota' AND model = 'Supra MK4';
UPDATE cars SET description = 'Немецкий спортивный седан BMW' WHERE brand = 'BMW' AND model = 'M3 E46';
UPDATE cars SET description = 'Современный немецкий спорткар BMW' WHERE brand = 'BMW' AND model = 'M4';
UPDATE cars SET description = 'Американский масл-кар с V8 двигателем' WHERE brand = 'Ford' AND model = 'Mustang GT';
UPDATE cars SET description = 'Американский спорткар с мощным двигателем' WHERE brand = 'Chevrolet' AND model = 'Camaro SS';
UPDATE cars SET description = 'Японский спорткар с двигателем 4G63T' WHERE brand = 'Mitsubishi' AND model = 'Lancer Evo';
UPDATE cars SET description = 'Японский спорткар с системой AWD' WHERE brand = 'Subaru' AND model = 'WRX STI';

-- Обновление мощности и крутящего момента
UPDATE cars SET power = '280 л.с.' WHERE brand = 'Nissan' AND model = 'Skyline R34';
UPDATE cars SET power = '250 л.с.' WHERE brand = 'Nissan' AND model = 'Silvia S14';
UPDATE cars SET power = '250 л.с.' WHERE brand = 'Nissan' AND model = 'Silvia S15';
UPDATE cars SET power = '280 л.с.' WHERE brand = 'Mazda' AND model = 'RX-7 FD3S';
UPDATE cars SET power = '320 л.с.' WHERE brand = 'Toyota' AND model = 'Supra A80';
UPDATE cars SET power = '280 л.с.' WHERE brand = 'Toyota' AND model = 'Supra MK4';
UPDATE cars SET power = '343 л.с.' WHERE brand = 'BMW' AND model = 'M3 E46';
UPDATE cars SET power = '431 л.с.' WHERE brand = 'BMW' AND model = 'M4';
UPDATE cars SET power = '460 л.с.' WHERE brand = 'Ford' AND model = 'Mustang GT';
UPDATE cars SET power = '455 л.с.' WHERE brand = 'Chevrolet' AND model = 'Camaro SS';
UPDATE cars SET power = '280 л.с.' WHERE brand = 'Mitsubishi' AND model = 'Lancer Evo';
UPDATE cars SET power = '300 л.с.' WHERE brand = 'Subaru' AND model = 'WRX STI';

-- Обновление крутящего момента
UPDATE cars SET torque = '392 Нм' WHERE brand = 'Nissan' AND model = 'Skyline R34';
UPDATE cars SET torque = '294 Нм' WHERE brand = 'Nissan' AND model = 'Silvia S14';
UPDATE cars SET torque = '294 Нм' WHERE brand = 'Nissan' AND model = 'Silvia S15';
UPDATE cars SET torque = '294 Нм' WHERE brand = 'Mazda' AND model = 'RX-7 FD3S';
UPDATE cars SET torque = '441 Нм' WHERE brand = 'Toyota' AND model = 'Supra A80';
UPDATE cars SET torque = '431 Нм' WHERE brand = 'Toyota' AND model = 'Supra MK4';
UPDATE cars SET torque = '365 Нм' WHERE brand = 'BMW' AND model = 'M3 E46';
UPDATE cars SET torque = '550 Нм' WHERE brand = 'BMW' AND model = 'M4';
UPDATE cars SET torque = '529 Нм' WHERE brand = 'Ford' AND model = 'Mustang GT';
UPDATE cars SET torque = '617 Нм' WHERE brand = 'Chevrolet' AND model = 'Camaro SS';
UPDATE cars SET torque = '369 Нм' WHERE brand = 'Mitsubishi' AND model = 'Lancer Evo';
UPDATE cars SET torque = '407 Нм' WHERE brand = 'Subaru' AND model = 'WRX STI';

-- Обновление разгона
UPDATE cars SET acceleration = '4.9 сек' WHERE brand = 'Nissan' AND model = 'Skyline R34';
UPDATE cars SET acceleration = '6.5 сек' WHERE brand = 'Nissan' AND model = 'Silvia S14';
UPDATE cars SET acceleration = '5.5 сек' WHERE brand = 'Nissan' AND model = 'Silvia S15';
UPDATE cars SET acceleration = '5.3 сек' WHERE brand = 'Mazda' AND model = 'RX-7 FD3S';
UPDATE cars SET acceleration = '4.6 сек' WHERE brand = 'Toyota' AND model = 'Supra A80';
UPDATE cars SET acceleration = '5.0 сек' WHERE brand = 'Toyota' AND model = 'Supra MK4';
UPDATE cars SET acceleration = '5.2 сек' WHERE brand = 'BMW' AND model = 'M3 E46';
UPDATE cars SET acceleration = '4.1 сек' WHERE brand = 'BMW' AND model = 'M4';
UPDATE cars SET acceleration = '4.3 сек' WHERE brand = 'Ford' AND model = 'Mustang GT';
UPDATE cars SET acceleration = '4.0 сек' WHERE brand = 'Chevrolet' AND model = 'Camaro SS';
UPDATE cars SET acceleration = '5.2 сек' WHERE brand = 'Mitsubishi' AND model = 'Lancer Evo';
UPDATE cars SET acceleration = '5.0 сек' WHERE brand = 'Subaru' AND model = 'WRX STI';

-- Обновление максимальной скорости
UPDATE cars SET "topSpeed" = '300 км/ч' WHERE brand = 'Nissan' AND model = 'Skyline R34';
UPDATE cars SET "topSpeed" = '230 км/ч' WHERE brand = 'Nissan' AND model = 'Silvia S14';
UPDATE cars SET "topSpeed" = '250 км/ч' WHERE brand = 'Nissan' AND model = 'Silvia S15';
UPDATE cars SET "topSpeed" = '250 км/ч' WHERE brand = 'Mazda' AND model = 'RX-7 FD3S';
UPDATE cars SET "topSpeed" = '280 км/ч' WHERE brand = 'Toyota' AND model = 'Supra A80';
UPDATE cars SET "topSpeed" = '270 км/ч' WHERE brand = 'Toyota' AND model = 'Supra MK4';
UPDATE cars SET "topSpeed" = '250 км/ч' WHERE brand = 'BMW' AND model = 'M3 E46';
UPDATE cars SET "topSpeed" = '280 км/ч' WHERE brand = 'BMW' AND model = 'M4';
UPDATE cars SET "topSpeed" = '290 км/ч' WHERE brand = 'Ford' AND model = 'Mustang GT';
UPDATE cars SET "topSpeed" = '290 км/ч' WHERE brand = 'Chevrolet' AND model = 'Camaro SS';
UPDATE cars SET "topSpeed" = '250 км/ч' WHERE brand = 'Mitsubishi' AND model = 'Lancer Evo';
UPDATE cars SET "topSpeed" = '250 км/ч' WHERE brand = 'Subaru' AND model = 'WRX STI';
