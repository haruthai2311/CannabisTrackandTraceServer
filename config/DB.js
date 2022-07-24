const mysql =require('mysql')
const DBconfig = require('./configDB');
const connection = mysql.createPool({
    host: DBconfig.HOST,
    user: DBconfig.USER,
    database: DBconfig.DATABASE,
    password: DBconfig.PASSWORD,
    port: DBconfig.PORT,
})

connection.getConnection((err) => {
    if(err){
        console.log('Error connecting to MySQL database = ',err)
        return;
    }
    console.log('MySQL successfuly connected!')
})

module.exports = connection;