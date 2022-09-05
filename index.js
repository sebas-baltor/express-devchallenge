const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
const path = require('path');
const router = require('./src/routes/router');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const myConnnection = require('express-myconnection');
const dbConnection ={
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
}

//cofiguration
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/src/views"));

// middlewares
app.use(myConnnection(mysql, dbConnection, 'single'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/",router);


// start server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})
