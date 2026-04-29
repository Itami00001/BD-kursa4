module.exports = app => {
  const parts = require("../controllers/part.controller.js");
  
  var router = require("express").Router();

  // Create a new part
  router.post("/", parts.create);

  // Retrieve all parts
  router.get("/", parts.findAll);

  // Retrieve a single part with id
  router.get("/:id", parts.findOne);

  // Update a part with id
  router.put("/:id", parts.update);

  // Delete a part with id
  router.delete("/:id", parts.delete);

  // Delete all parts
  router.delete("/", parts.deleteAll);

  // Get compatible parts for a specific car
  router.get("/car/:carId/compatible", parts.findCompatibleParts);

  app.use('/api/parts', router);
};
