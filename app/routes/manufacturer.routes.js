module.exports = app => {
  const manufacturers = require("../controllers/manufacturer.controller.js");
  
  var router = require("express").Router();

  // Create a new manufacturer
  router.post("/", manufacturers.create);

  // Retrieve all manufacturers
  router.get("/", manufacturers.findAll);

  // Retrieve a single manufacturer with id
  router.get("/:id", manufacturers.findOne);

  // Update a manufacturer with id
  router.put("/:id", manufacturers.update);

  // Delete a manufacturer with id
  router.delete("/:id", manufacturers.delete);

  // Delete all manufacturers
  router.delete("/", manufacturers.deleteAll);

  app.use('/api/manufacturers', router);
};
