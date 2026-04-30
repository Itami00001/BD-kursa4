const db = require('./app/models');

async function addMissingCars() {
  try {
    console.log('Adding missing cars for all countries...');
    
    const additionalCars = [
      // Czech cars
      { brand: 'Skoda', model: 'Octavia A5', year: 2008, country: 'Czech', description: 'Чешский седан с надежным двигателем', image: '🚗', power: '150 л.с.', torque: '250 Нм', acceleration: '8.5 сек', topSpeed: '210 км/ч', compatibilityRating: 7.5 },
      { brand: 'Skoda', model: 'Octavia A7', year: 2016, country: 'Czech', description: 'Современный чешский седан с улучшенными характеристиками', image: '🚗', power: '190 л.с.', torque: '320 Нм', acceleration: '7.2 сек', topSpeed: '240 км/ч', compatibilityRating: 8.0 },
      { brand: 'Skoda', model: 'Rapid', year: 2012, country: 'Czech', description: 'Компактный чешский автомобиль с турбонаддувом/атмосферным двигателем', image: '🚗', power: '95 л.с.', torque: '160 Нм', acceleration: '11.5 сек', topSpeed: '190 км/ч', compatibilityRating: 6.5 },
      
      // Korean cars
      { brand: 'Hyundai', model: 'Solaris', year: 2017, country: 'Korea', description: 'Корейский седан с надежным двигателем', image: '🚗', power: '123 л.с.', torque: '155 Нм', acceleration: '10.5 сек', topSpeed: '190 км/ч', compatibilityRating: 7.0 },
      { brand: 'Kia', model: 'Rio', year: 2018, country: 'Korea', description: 'Корейский седан с современным дизайном', image: '🚗', power: '123 л.с.', torque: '155 Нм', acceleration: '10.5 сек', topSpeed: '190 км/ч', compatibilityRating: 7.0 },
      
      // Swedish cars
      { brand: 'Volvo', model: 'S60', year: 2015, country: 'Sweden', description: 'Шведский седан с фокусом на безопасность', image: '🚗', power: '250 л.с.', torque: '350 Нм', acceleration: '6.4 сек', topSpeed: '240 км/ч', compatibilityRating: 8.5 },
      { brand: 'Volvo', model: 'XC60', year: 2017, country: 'Sweden', description: 'Шведский кроссовер с передовыми технологиями', image: '🚗', power: '254 л.с.', torque: '350 Нм', acceleration: '7.2 сек', topSpeed: '230 км/ч', compatibilityRating: 8.0 },
      
      // Italian cars
      { brand: 'Fiat', model: '500', year: 2016, country: 'Italy', description: 'Итальянский компактный автомобиль с классическим дизайном', image: '🚗', power: '69 л.с.', torque: '92 Нм', acceleration: '12.5 сек', topSpeed: '160 км/ч', compatibilityRating: 6.0 },
      { brand: 'Alfa Romeo', model: 'Giulia', year: 2017, country: 'Italy', description: 'Итальянский спортивный седан с характерным дизайном', image: '🚗', power: '280 л.с.', torque: '400 Нм', acceleration: '5.2 сек', topSpeed: '250 км/ч', compatibilityRating: 9.0 },
      
      // French cars
      { brand: 'Renault', model: 'Megane', year: 2018, country: 'France', description: 'Французский хэтчбек с современным дизайном', image: '🚗', power: '130 л.с.', torque: '205 Нм', acceleration: '9.8 сек', topSpeed: '200 км/ч', compatibilityRating: 7.0 },
      { brand: 'Peugeot', model: '308', year: 2019, country: 'France', description: 'Французский хэтчбек с премиальным интерьером', image: '🚗', power: '150 л.с.', torque: '250 Нм', acceleration: '8.8 сек', topSpeed: '215 км/ч', compatibilityRating: 7.5 },
      
      // British cars
      { brand: 'Mini', model: 'Cooper S', year: 2018, country: 'UK', description: 'Британский компактный автомобиль с спортивным характером', image: '🚗', power: '192 л.с.', torque: '280 Нм', acceleration: '6.7 сек', topSpeed: '235 км/ч', compatibilityRating: 8.0 },
      { brand: 'Jaguar', model: 'F-Type', year: 2017, country: 'UK', description: 'Британский спортивный автомобиль с мощным двигателем', image: '🚗', power: '340 л.с.', torque: '450 Нм', acceleration: '5.1 сек', topSpeed: '280 км/ч', compatibilityRating: 9.0 },
      
      // Spanish cars
      { brand: 'Seat', model: 'Leon', year: 2017, country: 'Spain', description: 'Испанский хэтчбек с спортивным характером', image: '🚗', power: '150 л.с.', torque: '250 Нм', acceleration: '8.3 сек', topSpeed: '215 км/ч', compatibilityRating: 7.5 },
      { brand: 'Seat', model: 'Ibiza', year: 2018, country: 'Spain', description: 'Испанский компактный автомобиль с современным дизайном', image: '🚗', power: '95 л.с.', torque: '175 Нм', acceleration: '10.9 сек', topSpeed: '190 км/ч', compatibilityRating: 6.5 }
    ];

    for (const car of additionalCars) {
      await db.sequelize.query(
        `INSERT INTO cars (brand, model, year, country, description, image, power, torque, acceleration, "topSpeed", "compatibilityRating") 
         VALUES (:brand, :model, :year, :country, :description, :image, :power, :torque, :acceleration, :topSpeed, :compatibilityRating)`,
        {
          replacements: {
            brand: car.brand,
            model: car.model,
            year: car.year,
            country: car.country,
            description: car.description,
            image: car.image,
            power: car.power,
            torque: car.torque,
            acceleration: car.acceleration,
            topSpeed: car.topSpeed,
            compatibilityRating: car.compatibilityRating
          }
        }
      );
      console.log(`Added ${car.brand} ${car.model} (${car.country})`);
    }

    console.log('All missing cars added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding cars:', error);
    process.exit(1);
  }
}

addMissingCars();
