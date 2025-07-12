const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure:false,
    auth:{
        user:'bunnyb12135@gmail.com',
        pass:'arjn dwcd lxys efiq'
    }
})

module.exports = transporter;