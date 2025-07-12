const express = require("express");
const BlogCategoryController = require("../controller/BlogCategoryController");
const { AuthCheck, RoleCheck } = require("../middleware/Auth");
const AdminAuthCheck = require("../middleware/AdminAuthCheck");
const router = express.Router();

router.post("/create-blog-category", AdminAuthCheck,RoleCheck("admin"), BlogCategoryController.create);
router.get("/create-blog-category-view", AdminAuthCheck,RoleCheck("admin"), BlogCategoryController.createView);

router.get("/blog-category-view", AdminAuthCheck,RoleCheck("admin"), BlogCategoryController.blogCategoryTableView);


/**
 * @swagger
 * /get-blog-categories:
 *   get:
 *     summary: Get all blog categories
 *     tags:
 *       - Blog Category
 *     security:
 *       - AuthHeader: []
 *     responses:
 *       '200':
 *         description: Categories fetched successfully
 *       '401':
 *         description: Unauthorized - missing or invalid token
 */

router.get(
  "/get-blog-categories",
  AuthCheck,
  BlogCategoryController.getBlogCategory
);
router.get(
  "/get-blog-category/:id",
  AdminAuthCheck,
  BlogCategoryController.getBlogCategoryById
);
router.post(
  "/update-blog-category/:id",
  AdminAuthCheck,
  RoleCheck("admin"),
  BlogCategoryController.updateBlogCategory
);
router.get(
  "/delete-blog-category/:id",
  AdminAuthCheck,
  RoleCheck("admin"),
  BlogCategoryController.deleteBlogCategory
);

module.exports = router;
