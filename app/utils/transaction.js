const { sequelize } = require("../models");

/**
 * Утилиты для работы с транзакциями
 * Поддерживает различные уровни изоляции и блокировки
 */

/**
 * Выполняет операцию в транзакции с указанным уровнем изоляции
 * @param {string} isolationLevel - Уровень изоляции ('READ_UNCOMMITTED', 'READ_COMMITTED', 'REPEATABLE_READ', 'SERIALIZABLE')
 * @param {Function} callback - Функция, выполняемая в транзакции
 * @param {Object} options - Дополнительные опции транзакции
 * @returns {Promise} Результат выполнения callback
 */
const executeTransaction = async (isolationLevel, callback, options = {}) => {
  const transaction = await sequelize.transaction({
    isolationLevel: sequelize.Transaction.ISOLATION_LEVELS[isolationLevel],
    ...options
  });

  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Выполняет операцию с пессимистической блокировкой
 * @param {Model} model - Sequelize модель
 * @param {number|Object} identifier - ID или条件 для поиска
 * @param {string} lockType - Тип блокировки ('UPDATE', 'KEY_SHARE', 'NO_KEY_UPDATE')
 * @param {Function} callback - Функция, выполняемая с заблокированной записью
 * @param {string} isolationLevel - Уровень изоляции
 * @returns {Promise} Результат выполнения callback
 */
const executeWithLock = async (model, identifier, lockType, callback, isolationLevel = 'READ_COMMITTED') => {
  return await executeTransaction(isolationLevel, async (transaction) => {
    const options = {
      lock: transaction.LOCK[lockType],
      transaction
    };

    let record;
    if (typeof identifier === 'object') {
      record = await model.findOne({ where: identifier, ...options });
    } else {
      record = await model.findByPk(identifier, options);
    }

    if (!record) {
      throw new Error('Record not found');
    }

    return await callback(record, transaction);
  });
};

/**
 * Выполняет массовую операцию с транзакцией
 * @param {Array} operations - Массив операций для выполнения
 * @param {string} isolationLevel - Уровень изоляции
 * @returns {Promise} Массив результатов
 */
const executeBulkOperations = async (operations, isolationLevel = 'READ_COMMITTED') => {
  return await executeTransaction(isolationLevel, async (transaction) => {
    const results = [];
    
    for (const operation of operations) {
      const { type, model, data, options = {} } = operation;
      
      let result;
      switch (type) {
        case 'create':
          result = await model.create(data, { ...options, transaction });
          break;
        case 'update':
          result = await model.update(data, { ...options, transaction });
          break;
        case 'delete':
          result = await model.destroy({ ...options, transaction });
          break;
        case 'bulkCreate':
          result = await model.bulkCreate(data, { ...options, transaction });
          break;
        case 'bulkUpdate':
          result = await model.update(data, { ...options, transaction });
          break;
        case 'bulkDelete':
          result = await model.destroy({ ...options, transaction });
          break;
        default:
          throw new Error(`Unsupported operation type: ${type}`);
      }
      
      results.push(result);
    }
    
    return results;
  });
};

/**
 * Проверяет наличие deadlock и повторяет операцию
 * @param {Function} operation - Операция для выполнения
 * @param {number} maxRetries - Максимальное количество попыток
 * @param {number} retryDelay - Задержка между попытками в мс
 * @returns {Promise} Результат операции
 */
const executeWithRetry = async (operation, maxRetries = 3, retryDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Проверяем на deadlock или serialization failure
      if (error.name === 'SequelizeDatabaseError' && 
          (error.message.includes('deadlock') || 
           error.message.includes('serialization failure') ||
           error.message.includes('could not serialize access'))) {
        
        if (attempt < maxRetries) {
          console.log(`Deadlock detected, retrying attempt ${attempt}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      
      // Если это не deadlock или последняя попытка, выбрасываем ошибку
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Создает точку сохранения (savepoint) в транзакции
 * @param {Transaction} transaction - Активная транзакция
 * @param {string} name - Имя точки сохранения
 * @returns {Promise} Точка сохранения
 */
const createSavepoint = async (transaction, name) => {
  return await sequelize.query(`SAVEPOINT ${name}`, { transaction });
};

/**
 * Откатывается к точке сохранения
 * @param {Transaction} transaction - Активная транзакция
 * @param {string} name - Имя точки сохранения
 * @returns {Promise}
 */
const rollbackToSavepoint = async (transaction, name) => {
  return await sequelize.query(`ROLLBACK TO SAVEPOINT ${name}`, { transaction });
};

/**
 * Выполняет операцию чтения с указанным уровнем изоляции
 * @param {Function} callback - Функция для выполнения
 * @param {string} isolationLevel - Уровень изоляции
 * @returns {Promise} Результат выполнения
 */
const executeReadOperation = async (callback, isolationLevel = 'READ_COMMITTED') => {
  return await executeTransaction(isolationLevel, async (transaction) => {
    // Для операций чтения можно установить режим только для чтения
    if (transaction.setReadOnly) {
      transaction.setReadOnly();
    }
    
    return await callback(transaction);
  });
};

/**
 * Логирует информацию о транзакции
 * @param {Transaction} transaction - Транзакция для логирования
 * @param {string} operation - Операция
 */
const logTransaction = (transaction, operation) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TRANSACTION] ${operation}:`, {
      id: transaction.id,
      isolationLevel: transaction.options.isolationLevel,
      finished: transaction.finished
    });
  }
};

// Предопределенные конфигурации для常见 сценариев
const TRANSACTION_SCENARIOS = {
  // Для заказов - предотвращение гонок и аномалий
  ORDER_CREATION: {
    isolationLevel: 'SERIALIZABLE',
    lockType: 'UPDATE',
    retryCount: 3
  },
  
  // Для обновления инвентаря
  INVENTORY_UPDATE: {
    isolationLevel: 'REPEATABLE_READ',
    lockType: 'KEY_SHARE',
    retryCount: 2
  },
  
  // Для финансовых операций
  FINANCIAL_OPERATION: {
    isolationLevel: 'SERIALIZABLE',
    lockType: 'UPDATE',
    retryCount: 5
  },
  
  // Для отчетов - согласованность данных
  REPORT_GENERATION: {
    isolationLevel: 'REPEATABLE_READ',
    lockType: null,
    retryCount: 1
  },
  
  // Для простых CRUD операций
  SIMPLE_CRUD: {
    isolationLevel: 'READ_COMMITTED',
    lockType: null,
    retryCount: 1
  }
};

/**
 * Выполняет операцию с предопределенными настройками сценария
 * @param {string} scenarioName - Имя сценария из TRANSACTION_SCENARIOS
 * @param {Function} callback - Функция для выполнения
 * @returns {Promise} Результат выполнения
 */
const executeScenario = async (scenarioName, callback) => {
  const scenario = TRANSACTION_SCENARIOS[scenarioName];
  
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioName}`);
  }
  
  const operation = async () => {
    if (scenario.lockType) {
      // Для операций с блокировкой нужно передать модель и идентификатор
      return await callback();
    } else {
      return await executeTransaction(scenario.isolationLevel, callback);
    }
  };
  
  if (scenario.retryCount > 1) {
    return await executeWithRetry(operation, scenario.retryCount);
  } else {
    return await operation();
  }
};

module.exports = {
  executeTransaction,
  executeWithLock,
  executeBulkOperations,
  executeWithRetry,
  createSavepoint,
  rollbackToSavepoint,
  executeReadOperation,
  logTransaction,
  TRANSACTION_SCENARIOS,
  executeScenario
};
