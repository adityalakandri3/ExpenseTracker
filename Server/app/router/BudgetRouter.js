const express = require("express");
const router = express.Router();
const BudgetController = require("../controller/BudgetController");
const { AuthCheck } = require("../middleware/Auth");

router.post("/create-budget", AuthCheck, BudgetController.create);
router.get("/get-budgets", AuthCheck, BudgetController.getAll);
router.get("/get-budget/:id", AuthCheck, BudgetController.getById);
router.post("/update-budget/:id", AuthCheck, BudgetController.update);
router.delete("/delete-budget/:id", AuthCheck, BudgetController.delete);
router.get("/getbudgetsummary", AuthCheck, BudgetController.getBudgetSummary);
module.exports = router;
