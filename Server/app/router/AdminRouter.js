const express = require('express');
const AdminController = require('../controller/AdminController');
const adminImage = require('../helper/adminImage');
const router = express.Router();
const AdminAuthCheck = require('../middleware/AdminAuthCheck')

router.get('/register',AdminController.registerView)
router.post('/create-admin',adminImage.single('image'),AdminController.createAdmin)
router.post('/login-admin',AdminController.loginAdmin)
router.get('/login',AdminController.loginView)
router.get('/logout',AdminAuthCheck,AdminController.logout)
router.get('/get-password/:id',AdminAuthCheck,AdminController.CheckAuth,AdminController.updatePasswordAdminView)
router.post('/update-password/:id',AdminAuthCheck,AdminController.CheckAuth,AdminController.updatePasswordAdmin)

router.get('/dashboard',AdminAuthCheck,AdminController.CheckAuth,AdminController.dashboard)

router.get('/forgot-password',AdminController.forgotpasswordView);
router.post('/reset-password-link',AdminController.resetPasswordLink);
router.get('/account/reset-password/:id/:token', AdminController.resetPasswordView);
router.post('/reset-password/:id/:token',AdminController.resetPassword);
router.get('/404-not-found',AdminAuthCheck,AdminController.CheckAuth,AdminController.notfound)

module.exports = router;