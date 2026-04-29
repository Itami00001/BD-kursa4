const db = require("../models");
const Car = db.cars;
const Op = db.Sequelize.Op;

// Create a new car
exports.create = (req, res) => {
  // Validate request
  if (!req.body.brand || !req.body.model || !req.body.year) {
    res.status(400).send({
      message: "Brand, model and year can not be empty!"
    });
    return;
  }

  // Create a car
  const car = {
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year
  };

  // Save car in the database
  Car.create(car)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the car."
      });
    });
};

// Retrieve all cars
exports.findAll = (req, res) => {
  const brand = req.query.brand;
  var condition = brand ? { brand: { [Op.like]: `%${brand}%` } } : null;

  Car.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cars."
      });
    });
};

// Find a single car with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Car.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find car with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving car with id=" + id
      });
    });
};

// Update a car by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Car.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Car was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update car with id=${id}. Maybe car was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating car with id=" + id
      });
    });
};

// Delete a car with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Car.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Car was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete car with id=${id}. Maybe car was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete car with id=" + id
      });
    });
};

// Delete all cars from the database
exports.deleteAll = (req, res) => {
  Car.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} cars were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cars."
      });
    });
};
