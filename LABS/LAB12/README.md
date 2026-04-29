# Лабораторная работа 12: Пессимистические и оптимистичные блокировки

## Цель работы
Изучить механизмы блокировок в базах данных, их типы и применение для предотвращения гонок данных.

## Теоретическая часть

### 1. Что такое блокировки?
Блокировка - это механизм, который ограничивает доступ к ресурсу (строке, таблице) для других транзакций, предотвращая конфликты при одновременном доступе.

### 2. Типы блокировок

#### Пессимистические блокировки (Pessimistic Locking)
Предполагают, что конфликты будут возникать часто. Блокировка устанавливается заранее и удерживается до конца транзакции.

**Типы пессимистических блокировок в PostgreSQL:**
- **ROW SHARE** - блокировка строки для чтения, другие могут читать
- **ROW EXCLUSIVE** - эксклюзивная блокировка строки для записи
- **SHARE UPDATE EXCLUSIVE** - блокировка таблицы для обновления
- **SHARE** - блокировка таблицы для чтения
- **SHARE ROW EXCLUSIVE** - блокировка таблицы для чтения с эксклюзивной блокировкой строк
- **EXCLUSIVE** - эксклюзивная блокировка таблицы
- **ACCESS EXCLUSIVE** - самая строгая блокировка таблицы

#### Оптимистичные блокировки (Optimistic Locking)
Предполагают, что конфликты возникают редко. Вместо блокировок используется проверка версии данных при обновлении.

### 3. Сценарии использования блокировок

#### Пессимистические блокировки подходят для:
- Финансовых операций (переводы денег, заказы)
- Управления инвентарем (остатки на складе)
- Редких, но критичных операций
- Ситуаций с высокой конкуренцией за данные

#### Оптимистичные блокировки подходят для:
- Частых операций чтения
- Низкой конкуренции за данные
- Пользовательских интерфейсов
- Систем с высокой производительностью

## Практические задания

### Задание 1: Пессимистические блокировки

Реализуйте следующие операции с пессимистическими блокировками:

1. **Бронирование деталей** - предотвращение продажи больше, чем есть на складе
2. **Обновление цен** - массовое обновление цен с блокировкой
3. **Перевод средств** - безопасный перевод между счетами
4. **Обновление статуса заказа** - предотвращение двойной обработки

### Задание 2: Оптимистичные блокировки

Реализуйте оптимистичную блокировку через версию:

1. **Редактирование профиля пользователя**
2. **Обновление настроек системы**
3. **Редактирование каталога деталей**
4. **Обновление информации об автомобиле**

### Задание 3: Сравнение производительности

Сравните производительность пессимистических и оптимистичных блокировок:

1. Замерьте время выполнения операций при разной нагрузке
2. Проверьте количество deadlock в каждом подходе
3. Оцените пропускную способность системы

## Примеры кода

### Пессимистическая блокировка для инвентаря
```javascript
const { executeWithLock } = require('../utils/transaction');

const reserveParts = async (partId, quantity) => {
  return await executeWithLock(Part, partId, 'UPDATE', async (part, transaction) => {
    const currentStock = part.stock;
    
    // Проверяем доступность
    if (currentStock < quantity) {
      throw new Error(`Недостаточно деталей на складе. Доступно: ${currentStock}, требуется: ${quantity}`);
    }

    // Резервируем детали
    await part.update({
      stock: currentStock - quantity,
      reserved: (part.reserved || 0) + quantity,
      lastUpdated: new Date()
    }, { transaction });

    return {
      success: true,
      reservedQuantity: quantity,
      remainingStock: currentStock - quantity
    };
  }, 'SERIALIZABLE');
};
```

### Пессимистическая блокировка для финансовой операции
```javascript
const transferMoney = async (fromAccountId, toAccountId, amount) => {
  return await executeTransaction('SERIALIZABLE', async (transaction) => {
    // Блокируем оба счета
    const fromAccount = await Account.findByPk(fromAccountId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    const toAccount = await Account.findByPk(toAccountId, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!fromAccount || !toAccount) {
      throw new Error('Один из счетов не найден');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Недостаточно средств на счете');
    }

    // Выполняем перевод
    await fromAccount.update({
      balance: fromAccount.balance - amount
    }, { transaction });

    await toAccount.update({
      balance: toAccount.balance + amount
    }, { transaction });

    // Создаем запись о транзакции
    await Transaction.create({
      fromAccountId,
      toAccountId,
      amount,
      status: 'completed',
      createdAt: new Date()
    }, { transaction });

    return {
      fromAccountBalance: fromAccount.balance,
      toAccountBalance: toAccount.balance
    };
  });
};
```

### Оптимистичная блокировка через версию
```javascript
// Добавляем поле version в модель
const Part = sequelize.define('Part', {
  // ... другие поля
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
});

// Метод обновления с оптимистичной блокировкой
const updatePartOptimistic = async (partId, updateData, expectedVersion) => {
  const [affectedCount] = await Part.update(
    {
      ...updateData,
      version: expectedVersion + 1
    },
    {
      where: {
        id: partId,
        version: expectedVersion
      }
    }
  );

  if (affectedCount === 0) {
    throw new Error('Данные были изменены другим пользователем. Обновите страницу и попробуйте снова.');
  }

  return await Part.findByPk(partId);
};
```

### Комбинированный подход
```javascript
const updatePartWithHybridLock = async (partId, updateData) => {
  try {
    // Сначала пробуем оптимистичную блокировку
    const part = await Part.findByPk(partId);
    const updatedPart = await updatePartOptimistic(partId, updateData, part.version);
    return updatedPart;
  } catch (error) {
    if (error.message.includes('изменены другим пользователем')) {
      // Если оптимистичная не сработала, используем пессимистическую
      return await executeWithLock(Part, partId, 'UPDATE', async (part, transaction) => {
        const updatedPart = await part.update(updateData, { transaction });
        return updatedPart;
      });
    }
    throw error;
  }
};
```

### Мониторинг блокировок
```javascript
const getLockStatus = async () => {
  const [locks] = await sequelize.query(`
    SELECT 
      t.relname AS table_name,
      l.locktype,
      l.mode,
      l.granted,
      a.query AS active_query,
      a.pid AS process_id,
      now() - a.query_start AS query_duration
    FROM pg_locks l
    JOIN pg_class t ON l.relation = t.oid
    JOIN pg_stat_activity a ON l.pid = a.pid
    WHERE l.granted = false
    ORDER BY query_duration DESC
  `);

  return locks;
};

const killBlockingProcess = async (pid) => {
  await sequelize.query(`SELECT pg_terminate_backend(${pid})`);
};
```

### Обработка deadlock
```javascript
const { executeWithRetry } = require('../utils/transaction');

const criticalUpdate = async (data) => {
  return await executeWithRetry(async () => {
    return await executeTransaction('SERIALIZABLE', async (transaction) => {
      // Критическая операция, которая может вызвать deadlock
      const result = await performCriticalUpdate(data, { transaction });
      return result;
    });
  }, 3, 1000); // 3 попытки с задержкой 1 секунда
};
```

## Демонстрация гонок данных

### Без блокировок (проблема)
```javascript
// Процесс 1
const process1 = async () => {
  const part = await Part.findByPk(1);
  console.log('Процесс 1: Текущий запас =', part.stock);
  
  // Имитация долгой операции
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await part.update({ stock: part.stock - 5 });
  console.log('Процесс 1: Новый запас =', part.stock - 5);
};

// Процесс 2 (выполняется параллельно)
const process2 = async () => {
  const part = await Part.findByPk(1);
  console.log('Процесс 2: Текущий запас =', part.stock);
  
  await part.update({ stock: part.stock - 3 });
  console.log('Процесс 2: Новый запас =', part.stock - 3);
};

// Результат: оба процесса прочитали одно и то же значение и некорректно обновили
```

### С пессимистической блокировкой (решение)
```javascript
// Процесс 1
const process1WithLock = async () => {
  return await executeWithLock(Part, 1, 'UPDATE', async (part, transaction) => {
    console.log('Процесс 1: Текущий запас =', part.stock);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await part.update({ stock: part.stock - 5 }, { transaction });
    console.log('Процесс 1: Новый запас =', part.stock - 5);
  });
};

// Процесс 2 (будет ждать завершения процесса 1)
const process2WithLock = async () => {
  return await executeWithLock(Part, 1, 'UPDATE', async (part, transaction) => {
    console.log('Процесс 2: Текущий запас =', part.stock);
    
    await part.update({ stock: part.stock - 3 }, { transaction });
    console.log('Процесс 2: Новый запас =', part.stock - 3);
  });
};
```

## Контрольные вопросы

1. В чем разница между пессимистическими и оптимистичными блокировками?
2. Когда следует использовать пессимистические блокировки?
3. Какие типы блокировок существуют в PostgreSQL?
4. Что такое deadlock и как его предотвратить?
5. Как реализовать оптимистичную блокировку?
6. Как мониторить блокировки в PostgreSQL?
7. Какие есть недостатки у каждого типа блокировок?

## Ожидаемые результаты

После выполнения лабораторной работы вы должны:
1. Понимать разницу между пессимистическими и оптимистичными блокировками
2. Уметь реализовывать оба типа блокировок в коде
3. Знать, когда какой тип блокировок применять
4. Уметь обрабатывать deadlock и другие проблемы с блокировками
5. Понимать влияние блокировок на производительность
6. Уметь мониторить и отлаживать проблемы с блокировками

## Дополнительные задания

1. Реализуйте таймауты для блокировок
2. Создайте систему приоритетов для блокировок
3. Реализуйте deadlock detection и automatic retry
4. Измерьте влияние блокировок на производительность при разной нагрузке
5. Создайте тесты для проверки правильности блокировок
