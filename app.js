require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');

const app = express();
const PORT = 5000 || process.env.PORT;

//connect to databse
connectDB();

app.use(express.static('public'));

//Templating engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set('layout','./layouts/main');

app.use('/',require('./server/routes/main'));

app.listen(PORT,()=>{
    console.log(`App running on port: ${PORT}`);
})