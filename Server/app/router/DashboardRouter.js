const express = require("express");
const router = express.Router();
const { AuthCheck } = require("../middleware/Auth");
const DashboardController = require('../controller/DashboardController')

router.get("/stats", AuthCheck, DashboardController.getSummary);

module.exports = router;
