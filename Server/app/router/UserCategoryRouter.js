const express = require("express");
const router = express.Router();
const { AuthCheck } = require("../middleware/Auth");
const UserCategoryController = require("../controller/UserCategoryController");

router.post("/create-category", AuthCheck, UserCategoryController.create);
router.get("/get-categories", AuthCheck, UserCategoryController.getAll);
router.get("/get-category-by-id/:id", AuthCheck, UserCategoryController.getById);
router.post("/update-catgory-by-id/:id", AuthCheck, UserCategoryController.update);
router.delete("/delete-category/:id", AuthCheck, UserCategoryController.delete);

module.exports = router;
