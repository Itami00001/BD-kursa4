# Data (SQL) — Tunning Manual 8080

Эта папка хранит **только SQL seed-файлы** для воспроизводимого разворачивания базы данных.

## Файлы

- `schema.sql` — дополнительные индексы/ограничения для стабильных сидов
- `seed_users.sql` — стартовые пользователи (`customers`)
- `seed_cars.sql` — стартовые автомобили (`cars`)
- `seed_parts_compatibility.sql` — детали и совместимость (categories/manufacturers/parts/compatibility)

## Применение (PowerShell)

```powershell
Get-Content data\schema.sql -Encoding UTF8 | docker-compose exec -T postgresdb psql -U postgres -d tunning_manual_db -v ON_ERROR_STOP=1
Get-Content data\seed_users.sql -Encoding UTF8 | docker-compose exec -T postgresdb psql -U postgres -d tunning_manual_db -v ON_ERROR_STOP=1
Get-Content data\seed_cars.sql -Encoding UTF8 | docker-compose exec -T postgresdb psql -U postgres -d tunning_manual_db -v ON_ERROR_STOP=1
Get-Content data\seed_parts_compatibility.sql -Encoding UTF8 | docker-compose exec -T postgresdb psql -U postgres -d tunning_manual_db -v ON_ERROR_STOP=1
```

## JSON-архив

Исходные JSON-датасеты перенесены в `data/json_archive/` и **не используются приложением в рантайме**.
