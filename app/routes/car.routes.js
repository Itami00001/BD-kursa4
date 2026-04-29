module.exports = app => {
  const cars = require("../controllers/car.controller.js");
  
  var router = require("express").Router();

  // Create a new car
  router.post("/", cars.create);

  // Retrieve all cars
  router.get("/", cars.findAll);

  // Retrieve a single car with id
  router.get("/:id", cars.findOne);

  // Update a car with id
  router.put("/:id", cars.update);

  // Delete a car with id
  router.delete("/:id", cars.delete);

  // Get cars by country
  router.get("/country/:country", cars.getCarsByCountry);

  // Get countries statistics
  router.get("/stats/countries", cars.getCountriesStats);

  app.use('/api/cars', router);
};
