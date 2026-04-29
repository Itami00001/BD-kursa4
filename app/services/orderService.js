const { orders, customers, parts, promotions } = require("../models");
const { executeTransaction } = require("../utils/transaction");

class OrderService {
  // Создать новый заказ с транзакцией
  async createOrder(orderData) {
    try {
      const result = await executeTransaction('SERIALIZABLE', async (transaction) => {
        // Проверяем существование клиента
        const customer = await customers.findByPk(orderData.customerId, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        
        if (!customer) {
          throw new Error('Customer not found');
        }

        // Проверяем существование промоакции
        let promotion = null;
        if (orderData.promotionId) {
          promotion = await promotions.findByPk(orderData.promotionId, {
            transaction,
            lock: transaction.LOCK.UPDATE
          });
          
          if (!promotion) {
            throw new Error('Promotion not found');
          }
        }

        // Рассчитываем итоговую сумму
        let totalAmount = orderData.amount || 0;
        if (promotion && promotion.discountPercent) {
          totalAmount = totalAmount * (1 - promotion.discountPercent / 100);
        }

        // Создаем заказ
        const newOrder = await orders.create({
          customerId: orderData.customerId,
          promotionId: orderData.promotionId,
          amount: totalAmount,
          status: orderData.status || 'pending',
          orderDate: new Date()
        }, { transaction });

        // Если есть детали в заказе, добавляем их
        if (orderData.parts && orderData.parts.length > 0) {
          for (const part of orderData.parts) {
            // Проверяем существование детали
            const partRecord = await parts.findByPk(part.id, {
              transaction,
              lock: transaction.LOCK.UPDATE
            });
            
            if (!partRecord) {
              throw new Error(`Part with ID ${part.id} not found`);
            }

            // Добавляем деталь к заказу через связующую таблицу
            await newOrder.addPart(partRecord, {
              through: {
                quantity: part.quantity || 1,
                price: partRecord.price * (part.quantity || 1)
              },
              transaction
            });
          }
        }

        return newOrder;
      });

      return result;
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Получить все заказы
  async getAllOrders() {
    try {
      const result = await orders.findAll({
        include: [
          { model: customers },
          { model: promotions },
          { model: parts }
        ]
      });
      return result;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Получить заказ по ID
  async getOrderById(id) {
    try {
      const order = await orders.findByPk(id, {
        include: [
          { model: customers },
          { model: promotions },
          { model: parts }
        ]
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  // Получить заказы клиента
  async getOrdersByCustomer(customerId) {
    try {
      const result = await orders.findAll({
        where: { customerId },
        include: [
          { model: promotions },
          { model: parts }
        ],
        order: [['orderDate', 'DESC']]
      });
      
      return result;
    } catch (error) {
      throw new Error(`Error fetching customer orders: ${error.message}`);
    }
  }

  // Обновить статус заказа с транзакцией
  async updateOrderStatus(id, status) {
    try {
      const result = await executeTransaction('READ_COMMITTED', async (transaction) => {
        const order = await orders.findByPk(id, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        
        if (!order) {
          throw new Error('Order not found');
        }

        // Валидация статуса
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
          throw new Error('Invalid status');
        }

        // Бизнес-логика для изменения статуса
        if (order.status === 'cancelled' && status !== 'cancelled') {
          throw new Error('Cannot change status from cancelled');
        }

        if (order.status === 'delivered' && status !== 'delivered') {
          throw new Error('Cannot change status from delivered');
        }

        await order.update({ status }, { transaction });
        
        return order;
      });

      return result;
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // Отменить заказ с транзакцией
  async cancelOrder(id) {
    try {
      const result = await executeTransaction('SERIALIZABLE', async (transaction) => {
        const order = await orders.findByPk(id, {
          include: [parts],
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        
        if (!order) {
          throw new Error('Order not found');
        }

        if (order.status === 'cancelled') {
          throw new Error('Order is already cancelled');
        }

        if (order.status === 'shipped' || order.status === 'delivered') {
          throw new Error('Cannot cancel shipped or delivered order');
        }

        // Обновляем статус
        await order.update({ status: 'cancelled' }, { transaction });
        
        // Здесь можно добавить логику возврата деталей на склад
        // или другие бизнес-процессы при отмене заказа
        
        return order;
      });

      return result;
    } catch (error) {
      throw new Error(`Error cancelling order: ${error.message}`);
    }
  }

  // Получить статистику заказов
  async getOrderStats() {
    try {
      const [stats] = await orders.sequelize.query(`
        SELECT 
          status,
          COUNT(*) as count,
          SUM(amount) as total_amount,
          AVG(amount) as avg_amount
        FROM orders
        GROUP BY status
        ORDER BY count DESC
      `);

      const [totalStats] = await orders.sequelize.query(`
        SELECT 
          COUNT(*) as total_orders,
          SUM(amount) as total_revenue,
          AVG(amount) as avg_order_value,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
        FROM orders
      `);

      return {
        byStatus: stats,
        total: totalStats[0]
      };
    } catch (error) {
      throw new Error(`Error fetching order stats: ${error.message}`);
    }
  }

  // Массовое обновление заказов с транзакцией
  async bulkUpdateStatus(orderIds, newStatus) {
    try {
      const result = await executeTransaction('SERIALIZABLE', async (transaction) => {
        const updatedOrders = await orders.update(
          { status: newStatus },
          {
            where: { id: orderIds },
            returning: true,
            transaction
          }
        );
        
        return updatedOrders[1];
      });

      return result;
    } catch (error) {
      throw new Error(`Error bulk updating orders: ${error.message}`);
    }
  }
}

module.exports = new OrderService();
