const express = require("express");
const UserController = require("../controller/UserController");
const { AuthCheck } = require("../middleware/Auth");
const userImage = require("../helper/userImage");
const router = express.Router();

/**
 * @swagger
 * /create-user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   state:
 *                     type: string
 *                   city:
 *                     type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - location
 *               - image
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Bad request, validation error
 */
router.post(
  "/create-user",
  userImage.single("image"),
  UserController.createUser
);
/**
 * @swagger
 * /login-user:
 *   post:
 *     summary: Login a user and receive a JWT token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword123"
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: "Login successful"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '400':
 *         description: Bad request – missing fields or validation failed
 *       '401':
 *         description: Invalid credentials
 */

router.post("/login-user", UserController.loginUser);

router.post("/verify-otp", UserController.verifyOTP);
router.post("/reset-password-link", UserController.resetPasswordLink);
router.post("/reset-password/:id/:token", UserController.resetPassword);

router.get("/user-dashboard", AuthCheck, UserController.userDashboard);
router.post("/update-password", AuthCheck, UserController.updatePassword);
router.get("/edit-user/:id", AuthCheck, UserController.editUser);
router.post(
  "/update-user/:id",
  AuthCheck,
  userImage.single("image"),
  UserController.updateUser
);
router.delete("/reset-data", AuthCheck, UserController.resetUserData);

module.exports = router;
