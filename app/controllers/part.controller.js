const db = require("../models");
const Part = db.parts;
const Category = db.categories;
const Manufacturer = db.manufacturers;
const Op = db.Sequelize.Op;

// Create a new part
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.price || !req.body.categoryId || !req.body.manufacturerId) {
    res.status(400).send({
      message: "Name, price, categoryId and manufacturerId can not be empty!"
    });
    return;
  }

  // Create a part
  const part = {
    name: req.body.name,
    price: req.body.price,
    categoryId: req.body.categoryId,
    manufacturerId: req.body.manufacturerId
  };

  // Save part in the database
  Part.create(part)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the part."
      });
    });
};

// Retrieve all parts
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Part.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving parts."
      });
    });
};

// Find a single part with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Part.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find part with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving part with id=" + id
      });
    });
};

// Update a part by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Part.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Part was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update part with id=${id}. Maybe part was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating part with id=" + id
      });
    });
};

// Delete a part with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Part.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Part was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete part with id=${id}. Maybe part was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete part with id=" + id
      });
    });
};

// Delete all parts from the database
exports.deleteAll = (req, res) => {
  Part.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} parts were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all parts."
      });
    });
};

// Get compatible parts for a specific car
exports.findCompatibleParts = (req, res) => {
  const carId = req.params.carId;

  db.sequelize.query(`
    SELECT p.* FROM parts p
    INNER JOIN compatibility c ON p.id = c.part_id
    WHERE c.car_id = :carId
  `, {
    replacements: { carId: carId },
    type: db.Sequelize.QueryTypes.SELECT
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving compatible parts for car with id=" + carId
      });
    });
};
