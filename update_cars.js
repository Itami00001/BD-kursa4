const db = require('./app/models');

async function updateCars() {
  try {
    console.log('Updating car descriptions...');
    
    const updates = [
      { brand: 'Nissan', model: 'Skyline R34', description: 'Легендарный японский спорткар с двигателем RB26DETT' },
      { brand: 'Nissan', model: 'Silvia S14', description: 'Классический японский дрифт-кар с двигателем SR20DET' },
      { brand: 'Nissan', model: 'Silvia S15', description: 'Современный японский спорткар с улучшенной подвеской' },
      { brand: 'Mazda', model: 'RX-7 FD3S', description: 'Легендарный роторный спорткар Mazda' },
      { brand: 'Toyota', model: 'Supra A80', description: 'Легендарный японский спорткар с двигателем 2JZ-GTE' },
      { brand: 'Toyota', model: 'Supra MK4', description: 'Современный японский спорткар с турбонаддувом' },
      { brand: 'BMW', model: 'M3 E46', description: 'Немецкий спортивный седан BMW' },
      { brand: 'BMW', model: 'M4', description: 'Современный немецкий спорткар BMW' },
      { brand: 'Ford', model: 'Mustang GT', description: 'Американский масл-кар с V8 двигателем' },
      { brand: 'Chevrolet', model: 'Camaro SS', description: 'Американский спорткар с мощным двигателем' },
      { brand: 'Mitsubishi', model: 'Lancer Evo', description: 'Японский спорткар с двигателем 4G63T' },
      { brand: 'Subaru', model: 'WRX STI', description: 'Японский спорткар с системой AWD' }
    ];

    for (const update of updates) {
      await db.sequelize.query(
        'UPDATE cars SET description = :description WHERE brand = :brand AND model = :model',
        {
          replacements: { 
            description: update.description, 
            brand: update.brand, 
            model: update.model 
          },
          type: db.sequelize.QueryTypes.UPDATE
        }
      );
      console.log(`Updated ${update.brand} ${update.model}`);
    }

    console.log('All cars updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating cars:', error);
    process.exit(1);
  }
}

updateCars();
