// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view (Employee/Admin only)
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view (Public)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view (Public)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build add classification view (Employee/Admin only)
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification (Employee/Admin only)
router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
)

// Route to build add inventory view (Employee/Admin only)
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory (Employee/Admin only)
router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.processAddInventory)
)

// Route to get inventory items by classification_id (JSON response - Employee/Admin only)
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view (Employee/Admin only)
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route to process inventory update (Employee/Admin only)
router.post(
  "/update",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Route to build delete confirmation view (Employee/Admin only)
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView))

// Route to process inventory delete (Employee/Admin only)
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteItem))

// Route to trigger intentional 500 error
router.get("/trigger-error", (req, res, next) => {
  throw new Error("Intentional 500 error for testing purposes")
});

module.exports = router;