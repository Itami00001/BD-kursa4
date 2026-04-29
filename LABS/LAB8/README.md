# Лабораторная работа 8: Создание и чтение записей

## Цель работы
Изучить базовые операции создания (Create) и чтения (Read) записей в базе данных с использованием Sequelize ORM.

## Теоретическая часть

### 1. CRUD операции
CRUD - это четыре базовые операции для работы с данными:
- **Create** - создание новых записей
- **Read** - чтение существующих записей
- **Update** - обновление существующих записей
- **Delete** - удаление существующих записей

### 2. Методы Sequelize для создания записей
- `Model.create()` - создание одной записи
- `Model.bulkCreate()` - массовое создание записей
- `Model.build()` - создание экземпляра без сохранения

### 3. Методы Sequelize для чтения записей
- `Model.findAll()` - получение всех записей
- `Model.findByPk()` - поиск по первичному ключу
- `Model.findOne()` - поиск первой записи по условию
- `Model.findOrCreate()` - поиск или создание записи

## Практические задания

### Задание 1: Создание записей
Создайте следующие записи в базе данных:

1. **Автомобили:**
   - Toyota Supra, 2020, Japan
   - BMW M3, 2021, Germany
   - Nissan GT-R, 2019, Japan

2. **Детали:**
   - Турбокомпрессор Garrett GT35, цена 150000
   - Тормозная система Brembo, цена 85000
   - Выпускная система Akrapovic, цена 120000

3. **Категории:**
   - Двигатель
   - Тормозная система
   - Выпускная система

4. **Производители:**
   - Garrett
   - Brembo
   - Akrapovic

### Задание 2: Чтение записей
Реализуйте следующие запросы:

1. Получите все автомобили
2. Получите автомобиль по ID
3. Получите все детали определенной категории
4. Получите детали определенного производителя
5. Получите автомобиль с включенными связями

### Задание 3: Поиск и фильтрация
1. Найдите автомобили по марке
2. Найдите детали в ценовом диапазоне
3. Получите автомобили определенной страны

## Примеры кода

### Создание автомобиля
```javascript
const carService = require('../services/carService');

// Создание одного автомобиля
const newCar = await carService.createCar({
  brand: 'Toyota',
  model: 'Supra',
  year: 2020,
  country: 'Japan',
  description: 'Спортивный автомобиль',
  power: '280 л.с.',
  torque: '350 Нм',
  acceleration: '4.3 сек',
  topSpeed: '280 км/ч',
  compatibilityRating: 8.5
});

console.log('Создан автомобиль:', newCar.toJSON());
```

### Массовое создание деталей
```javascript
const partService = require('../services/partService');

const partsData = [
  {
    name: 'Турбокомпрессор Garrett GT35',
    price: 150000,
    categoryId: 1,
    manufacturerId: 1,
    powerGain: 100,
    torqueGain: 150,
    compatibilityScore: 8,
    installDifficulty: 6
  },
  // ... другие детали
];

const createdParts = await partService.bulkCreateParts(partsData);
console.log('Создано деталей:', createdParts.length);
```

### Чтение с фильтрацией
```javascript
const partService = require('../services/partService');

// Получение деталей по категории
const engineParts = await partService.getPartsByCategory(1);
console.log('Детали категории "Двигатель":', engineParts);

// Поиск деталей по названию
const searchResults = await partService.searchParts('турбо');
console.log('Результаты поиска:', searchResults);
```

### Чтение с включенными связями
```javascript
const carService = require('../services/carService');

// Получение автомобиля с совместимыми деталями
const carWithParts = await carService.getCarById(1);
console.log('Автомобиль с деталями:', carWithParts);
```

## Контрольные вопросы

1. Какие методы Sequelize используются для создания записей?
2. В чем разница между `findAll()` и `findOne()`?
3. Как работает метод `findOrCreate()`?
4. Какие преимущества дает использование сервисного слоя?
5. Как обрабатываются ошибки при работе с базой данных?

## Тестовые данные

Для выполнения заданий используйте следующие тестовые данные:

```javascript
// Автомобили
const cars = [
  { brand: 'Toyota', model: 'Supra', year: 2020, country: 'Japan' },
  { brand: 'BMW', model: 'M3', year: 2021, country: 'Germany' },
  { brand: 'Nissan', model: 'GT-R', year: 2019, country: 'Japan' }
];

// Категории
const categories = [
  { name: 'Двигатель' },
  { name: 'Тормозная система' },
  { name: 'Выпускная система' }
];

// Производители
const manufacturers = [
  { name: 'Garrett' },
  { name: 'Brembo' },
  { name: 'Akrapovic' }
];
```

## Ожидаемые результаты

После выполнения лабораторной работы вы должны:
1. Уметь создавать записи в базе данных
2. Уметь читать записи с различными фильтрами
3. Понимать разницу между различными методами Sequelize
4. Уметь обрабатывать ошибки при работе с базой данных
5. Иметь практический опыт работы с сервисным слоем

## Дополнительные задания

1. Реализуйте валидацию данных перед созданием
2. Добавьте логирование операций
3. Создайте функцию для массового импорта данных из JSON
4. Реализуйте пагинацию при чтении большого количества записей
