const express= require('express');
const ContactController = require('../controller/ContactController');
const router = express.Router();

router.post('/contact-message',ContactController.contact);


module.exports=router;