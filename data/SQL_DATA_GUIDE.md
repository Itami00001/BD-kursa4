# SQL Data Guide — Tunning Manual 8080

## 📁 Структура данных

```
data/
├── seed_parts_compatibility.sql    # Seed деталей и совместимости из всех JSON (UTF-8)
├── parts1.json                      # Оригинальные данные деталей (vehicle/name/...)
├── jdm.json                         # Японские автомобили и детали (id/specs)
├── jdm-parts.json                   # Японские детали (compatibility/requires/synergy)
├── europe.json                      # Европейские автомобили и детали
├── europe-parts.json                # Европейские детали
└── czech-parts.json                 # Чешские детали
```

## 🚀 Как поднять базу из SQL

```powershell
# PowerShell (рекомендуется)
Get-Content data\seed_parts_compatibility.sql -Encoding UTF8 | docker-compose exec -T postgresdb psql -U postgres -d tunning_manual_db -v ON_ERROR_STOP=1
```

**Результат:**
- Categories: 23
- Manufacturers: 14  
- Parts: 88
- Compatibility rows: 35

## 🔧 Что делает seed-скрипт

- Полностью пересоздает доменные таблицы (`TRUNCATE ... RESTART IDENTITY`)
- Загружает категории, производителей, детали из всех JSON
- Создает связи совместимости между автомобилями и деталями
- Работает с UTF-8, без `?????` в данных

## ⚠️ Важные моменты

- **JSON больше не используются в рантайме** — только для генерации SQL
- При повторном запуске seed **полностью заменяет** данные в `parts/.../compatibility`
- `cars` **не трогаются** —seed только детали и совместимость
- Если нужно добавить/изменить данные — меняйте JSON и пересоберите SQL (см. ниже)

## 🛠️ Как пересобрать SQL из JSON

```powershell
# Сгенерировать новый seed
node scripts\json_to_sql.js

# Применить (см. выше)
```

> **Примечание:** Генератор создаёт `data\seed_parts_compatibility.sql`

## 📊 Статус после загрузки

- `Nissan Silvia S14` — **7 совместимых деталей** (ранее 0)
- `Toyota Supra A80` — **8 деталей**
- `Mazda RX-7 FD3S` — **9 деталей**
- Все остальные — согласно JSON

## 📝 Источники данных

- **parts1.json** — основной список деталей с описаниями и совместимостью
- **jdm/europe(-parts).json** — расширенные данные с `id`, `requires`, `synergy`, `specs`
- Генератор объединяет оба формата, дедуплицирует по имени детали

## 🧹 Устаревшие файлы (удалены)

- ✅ `fix_*.sql`, `update_*.js` — временные скрипты миграции (удалены)
- ⚠️ `init.sql` — старый seed с кривой кодировкой (остаётся для справки)
- ✅ Все временные файлы почистены из корня

---

**✅ Теперь вся БД в открытом доступе только для админа — через SQL seed.**
