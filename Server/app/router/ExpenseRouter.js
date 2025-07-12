const express = require('express');
const router = express.Router();
const ExpenseController = require('../controller/ExpenseController');
const { AuthCheck } = require('../middleware/Auth');

router.post('/create-expense', AuthCheck, ExpenseController.create);
router.get('/get-expenses', AuthCheck, ExpenseController.getAll);
router.get('/get-expense/:id', AuthCheck, ExpenseController.getById);
router.post('/update-expense/:id', AuthCheck, ExpenseController.update);
router.delete('/delete-expense/:id', AuthCheck, ExpenseController.delete);
router.get('/filter-expense', AuthCheck, ExpenseController.filterExpenses);

module.exports = router;
