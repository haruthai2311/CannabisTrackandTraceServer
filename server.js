const express = require('express');
const status  = require('http-status');
const app = express();

//MySQL Connection
//const connection = require('./config/DB');app.use(cors());
app.get('/', (req, res) => res.send({ ok: true, message: 'Welcome to my api server!',code: status.OK}));

const RouteUser = require('./Routes/User');
app.use('/users',RouteUser);

const date_ob = new Date();
const day = ("0" + date_ob.getDate()).slice(-2);
const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
const year = date_ob.getFullYear();
const hours = date_ob.getHours();
const minutes = date_ob.getMinutes();
const seconds = date_ob.getSeconds();
  
const dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
console.log(dateTime);


app.listen(3000,()=> console.log('Server is running on port 3000!'));

