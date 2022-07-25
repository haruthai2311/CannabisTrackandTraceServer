const express = require('express');
const status  = require('http-status');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//MySQL Connection
//const connection = require('./config/DB');app.use(cors());
app.get('/', (req, res) => res.send({ ok: true, message: 'Welcome to my api server!',code: status.OK}));

const RouteUser = require('./Routes/User');
app.use('/users',RouteUser);

const dateTime = require('./Routes/dateTime')
console.log(dateTime);


app.listen(3000,()=> console.log('Server is running on port 3000!'));

