#!/bin/bash
docker-compose exec -T postgresdb psql -U postgres -d tunning_manual_db <<EOF
SET client_encoding = 'UTF8';
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
EOF
