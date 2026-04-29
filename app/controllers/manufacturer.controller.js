const db = require("../models");
const Manufacturer = db.manufacturers;
const Op = db.Sequelize.Op;

// Create a new manufacturer
exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const manufacturer = {
    name: req.body.name
  };

  Manufacturer.create(manufacturer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the manufacturer."
      });
    });
};

// Retrieve all manufacturers
exports.findAll = (req, res) => {
  Manufacturer.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving manufacturers."
      });
    });
};

// Find a single manufacturer with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Manufacturer.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find manufacturer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving manufacturer with id=" + id
      });
    });
};

// Update a manufacturer by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Manufacturer.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Manufacturer was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update manufacturer with id=${id}. Maybe manufacturer was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating manufacturer with id=" + id
      });
    });
};

// Delete a manufacturer with the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Manufacturer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Manufacturer was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete manufacturer with id=${id}. Maybe manufacturer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete manufacturer with id=" + id
      });
    });
};

// Delete all manufacturers from the database
exports.deleteAll = (req, res) => {
  Manufacturer.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} manufacturers were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all manufacturers."
      });
    });
};
