const express = require('express');
const router = express.Router();
const AdminStatsController = require('../controller/AdminStatsController');
const AdminAuthCheck = require('../middleware/AdminAuthCheck');
const AdminController = require('../controller/AdminController');


//expense
router.get('/',AdminAuthCheck,AdminController.CheckAuth,AdminStatsController.dashboardView)
router.get('/user-details-view/:id',AdminAuthCheck,AdminController.CheckAuth,AdminStatsController.userDetailsView)

//blogs
router.get('/get-blog-stats',AdminAuthCheck,AdminController.CheckAuth,AdminStatsController.getDashboardStats);
router.get('/edit-post/:id',AdminAuthCheck,AdminController.CheckAuth,AdminStatsController.getBlogPostById);
router.get('/delete-post/:id',AdminAuthCheck,AdminController.CheckAuth,AdminStatsController.deletePostById);

module.exports = router;
