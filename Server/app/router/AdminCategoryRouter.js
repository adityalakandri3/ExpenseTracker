const express = require("express");
const AdminCategoryController = require("../controller/AdminCategoryController");
const { AuthCheck, RoleCheck } = require("../middleware/Auth");
const AdminAuthCheck = require("../middleware/AdminAuthCheck");

const router = express.Router();

router.post("/create-category", AdminAuthCheck, AdminCategoryController.create);
router.get("/add-category-view", AdminAuthCheck, AdminCategoryController.addCategoryView);

router.get("/get-categories", AdminAuthCheck, AdminCategoryController.getCategories);

router.get("/get-category/:id", AdminAuthCheck, AdminCategoryController.getCategoryById);

router.post(
  "/update-category/:id",
  AdminAuthCheck,
  RoleCheck(["admin"]),
  AdminCategoryController.updateCategory
);


router.post(
  "/delete-category/:id",
  AdminAuthCheck,
  AdminCategoryController.deleteCategory
);

module.exports = router;
