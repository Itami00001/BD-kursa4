# Лабораторная работа 11: Основы транзакций и уровни изоляции

## Цель работы
Изучить концепцию транзакций в базах данных, уровни изоляции и их влияние на целостность данных.

## Теоретическая часть

### 1. Что такое транзакция?
Транзакция - это логическая единица работы, которая содержит одну или несколько операций с базой данных. Транзакция обеспечивает **атомарность** - все операции либо успешно выполняются, либо все откатываются.

### 2. ACID свойства транзакций
- **Atomicity (Атомарность)** - транзакция неделима, все операции выполняются как единое целое
- **Consistency (Согласованность)** - база данных переходит из одного согласованного состояния в другое
- **Isolation (Изолированность)** - транзакции не мешают друг другу
- **Durability (Долговечность)** - результаты успешной транзакции сохраняются даже при сбое системы

### 3. Уровни изоляции в PostgreSQL

#### READ UNCOMMITTED
- Самый низкий уровень изоляции
- Транзакция может видеть незафиксированные изменения других транзакций
- **Проблемы:** "грязное чтение" (dirty read)

#### READ COMMITTED (по умолчанию)
- Транзакция видит только зафиксированные изменения
- **Проблемы:** неповторяемое чтение (non-repeatable read), фантомные записи (phantom read)

#### REPEATABLE READ
- Транзакция видит снимок данных на момент начала
- Гарантирует, что при повторном чтении тех же данных получим тот же результат
- **Проблемы:** фантомные записи (phantom read)

#### SERIALIZABLE
- Самый строгий уровень изоляции
- Транзакции выполняются последовательно, как будто одна за другой
- **Преимущества:** полная защита от всех аномалий параллелизма

### 4. Аномалии параллелизма

#### Lost Update (Потерянное обновление)
Две транзакции читают и обновляют одну и ту же запись. Обновление одной транзакции теряется.

#### Dirty Read (Грязное чтение)
Транзакция читает незафиксированные изменения другой транзакции.

#### Non-repeatable Read (Неповторяемое чтение)
Транзакция читает данные дважды и получает разные результаты из-за изменений другой транзакции.

#### Phantom Read (Фантомные записи)
Транзакция выполняет один и тот же запрос дважды и получает разное количество строк из-за вставки/удаления другой транзакции.

## Практические задания

### Задание 1: Демонстрация уровней изоляции

Создайте сценарий с двумя конкурентными транзакциями для демонстрации аномалий:

1. **Lost Update:** Два пользователя одновременно обновляют баланс счета
2. **Dirty Read:** Один пользователь читает баланс, другой изменяет его
3. **Non-repeatable Read:** Пользователь читает отчет дважды во время обновления данных
4. **Phantom Read:** Пользователь ищет детали по критерию, другой добавляет/удаляет детали

### Задание 2: Транзакции в реальном проекте

Реализуйте следующие транзакционные операции:

1. **Создание заказа** с проверкой баланса клиента
2. **Обновление инвентаря** деталей
3. **Массовое обновление цен** с транзакцией
4. **Создание отчета** с согласованными данными

### Задание 3: Уровни изоляции для разных сценариев

Определите подходящий уровень изоляции для следующих операций:

1. **Финансовые операции** (перевод денег, заказы)
2. **Аналитические отчеты** (статистика, агрегация)
3. **Простое чтение данных** (просмотр каталога)
4. **Массовая загрузка данных**

## Примеры кода

### Транзакция с уровнем SERIALIZABLE
```javascript
const { executeTransaction } = require('../utils/transaction');
const orderService = require('../services/orderService');

// Создание заказа с защитой от гонок
const createOrder = async (orderData) => {
  return await executeTransaction('SERIALIZABLE', async (transaction) => {
    // Блокируем запись клиента для проверки баланса
    const customer = await Customer.findByPk(orderData.customerId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!customer) {
      throw new Error('Клиент не найден');
    }

    // Проверяем баланс
    if (customer.balance < orderData.amount) {
      throw new Error('Недостаточно средств');
    }

    // Создаем заказ
    const order = await Order.create({
      customerId: orderData.customerId,
      amount: orderData.amount,
      status: 'pending'
    }, { transaction });

    // Обновляем баланс клиента
    await customer.update({
      balance: customer.balance - orderData.amount
    }, { transaction });

    return order;
  });
};
```

### Транзакция с пессимистической блокировкой
```javascript
const { executeWithLock } = require('../utils/transaction');

const updateInventory = async (partId, quantity) => {
  return await executeWithLock(Part, partId, 'UPDATE', async (part, transaction) => {
    const currentStock = part.stock;
    
    if (currentStock < quantity) {
      throw new Error(`Недостаточно на складе. Текущий запас: ${currentStock}`);
    }

    // Обновляем количество
    await part.update({
      stock: currentStock - quantity,
      lastUpdated: new Date()
    }, { transaction });

    return part;
  });
};
```

### Транзакция с точкой сохранения
```javascript
const { createSavepoint, rollbackToSavepoint } = require('../utils/transaction');

const complexOrderProcessing = async (orderData) => {
  return await executeTransaction('REPEATABLE_READ', async (transaction) => {
    // Создаем точку сохранения
    await createSavepoint(transaction, 'before_order_creation');
    
    try {
      // Шаг 1: Создаем заказ
      const order = await Order.create(orderData, { transaction });
      
      // Создаем точку сохранения перед добавлением деталей
      await createSavepoint(transaction, 'before_parts_addition');
      
      try {
        // Шаг 2: Добавляем детали к заказу
        for (const part of orderData.parts) {
          await order.addPart(part, { transaction });
        }
        
        // Шаг 3: Обновляем статус заказа
        await order.update({ status: 'confirmed' }, { transaction });
        
      } catch (error) {
        // Если ошибка при добавлении деталей, откатываем к точке сохранения
        await rollbackToSavepoint(transaction, 'before_parts_addition');
        
        // Удаляем заказ
        await order.destroy({ transaction });
        throw error;
      }
      
      return order;
      
    } catch (error) {
      // Если ошибка на первом шаге, откатываем к началу
      await rollbackToSavepoint(transaction, 'before_order_creation');
      throw error;
    }
  });
};
```

### Обработка deadlock с повторными попытками
```javascript
const { executeWithRetry } = require('../utils/transaction');

const criticalOperation = async (data) => {
  return await executeWithRetry(async () => {
    return await executeTransaction('SERIALIZABLE', async (transaction) => {
      // Критическая операция, которая может вызвать deadlock
      const result = await someCriticalDatabaseOperation(data, { transaction });
      return result;
    });
  }, 3, 1000); // 3 попытки с задержкой 1 секунда
};
```

## Контрольные вопросы

1. Что такое транзакция и зачем она нужна?
2. Какие ACID свойства вы знаете?
3. В чем разница между уровнями изоляции?
4. Когда следует использовать уровень SERIALIZABLE?
5. Что такое deadlock и как с ним бороться?
6. Какие виды блокировок существуют в PostgreSQL?
7. Какой уровень изоляции используется по умолчанию в PostgreSQL?

## Демонстрация аномалий

### Lost Update
```javascript
// Транзакция 1
const transaction1 = async () => {
  const account = await Account.findByPk(1);
  const balance = account.balance;
  
  // Имитация долгой операции
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await account.update({ balance: balance - 100 });
};

// Транзакция 2 (выполняется параллельно)
const transaction2 = async () => {
  const account = await Account.findByPk(1);
  const balance = account.balance;
  
  await account.update({ balance: balance - 50 });
};
```

### Phantom Read
```javascript
// Транзакция 1
const transaction1 = async () => {
  const parts = await Part.findAll({ where: { price: { [Op.gt]: 1000 } } });
  console.log('Найдено дорогих деталей:', parts.length);
  
  // Имитация долгой операции
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const partsAfter = await Part.findAll({ where: { price: { [Op.gt]: 1000 } } });
  console.log('После паузы:', partsAfter.length);
};

// Транзакция 2 (добавляет новую дорогую деталь)
const transaction2 = async () => {
  await Part.create({
    name: 'Новая дорогая деталь',
    price: 2000,
    categoryId: 1
  });
};
```

## Ожидаемые результаты

После выполнения лабораторной работы вы должны:
1. Понимать концепцию транзакций и ACID свойства
2. Знать уровни изоляции и их характеристики
3. Уметь выбирать подходящий уровень изоляции для разных сценариев
4. Реализовывать транзакции в коде с использованием Sequelize
5. Понимать аномалии параллелизма и способы их предотвращения
6. Использовать блокировки для предотвращения гонок данных

## Дополнительные задания

1. Реализуйте мониторинг транзакций
2. Создайте тесты для проверки аномалий параллелизма
3. Измерьте производительность разных уровней изоляции
4. Реализуйте распределенную транзакцию (если возможно)
