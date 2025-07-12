const express = require ('express');
const app = express();
const path = require('path');
const fs = require('fs')
const ejs = require('ejs')
const cors = require('cors');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const dotenv = require('dotenv');
const flash = require('connect-flash')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const SwaggerOptions = require('./swagger.json');
const swaggerDocument = swaggerJsDoc(SwaggerOptions);
//database connection
const dbConnect = require('./app/config/db')
dotenv.config();
dbConnect()

//setting up cors
app.use(cors());


//sessions and cookies
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
     }
  }))

  app.use(flash());
  app.use(cookieParser());

//setting up template engine
app.set('view engine','ejs')
app.set('views','views')


//setup body parser
app.use(express.json({
    limit:'50mb',
    extended:true
}));
app.use(express.urlencoded({extended:true}))

//static folder
app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static('uploads'))
app.use('uploads',express.static(path.join(__dirname,'/uploads')));


//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Routes
const UserRoute = require('./app/router/UsersRouter')
app.use(UserRoute);

const AdminRoute = require('./app/router/AdminRouter')
app.use('/admin',AdminRoute);

const AdminCategoryRoute = require('./app/router/AdminCategoryRouter')
app.use(AdminCategoryRoute);

const UserCategoryRoute = require('./app/router/UserCategoryRouter')
app.use('/user',UserCategoryRoute);

const ExpenseRoute = require('./app/router/ExpenseRouter')
app.use(ExpenseRoute);

const BudgetRoute = require('./app/router/BudgetRouter')
app.use(BudgetRoute);

const DashboardRoute = require('./app/router/DashboardRouter')
app.use(DashboardRoute);

const AdminStatsRoute = require('./app/router/AdminStatsRouter')
app.use('/admin',AdminStatsRoute);

const BlogCategoryRoute = require('./app/router/BlogCategoryRouter')
app.use(BlogCategoryRoute);

const PostsRoute = require('./app/router/PostsRouter')
app.use(PostsRoute);

const CommentRoute = require('./app/router/CommentRouter')
app.use(CommentRoute);


const ContactRoute = require('./app/router/ContactRouter');
app.use(ContactRoute);
//listening port
const port = process.env.PORT || 3006 ;
app.listen(port,()=>{
    console.log(`Server is running at port: ${port}`)
})