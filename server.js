const express = require('express');
const status = require('http-status');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//MySQL Connection
//const connection = require('./config/DB');app.use(cors());
app.get('/', (req, res) => res.send({ ok: true, message: 'Welcome to my api server!❤', code: status.OK }));

const RouteUser = require('./Routes/RouteUser');
app.use('/users', RouteUser);

const RouteTracking = require('./Routes/RouteTracking');
app.use('/trackings', RouteTracking)

const RouteInformations = require('./Routes/RouteInformations')
app.use('/informations', RouteInformations)

const Time = require('./Controller/dateTime')
console.log(Time.dateTime);

const UploadRouter = require('./Routes/RouteUpload')
app.use('/upload', UploadRouter)

app.use(express.static('assets/ImagesUploaded'))

app.listen(3000, () => console.log('Server is running on port 3000!'));

