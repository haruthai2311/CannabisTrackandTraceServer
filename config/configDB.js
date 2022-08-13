const mysql = require('mysql');
const promisify = require('util.promisify');
require('dotenv').config();
const {MYSQL_USERNAME, MYSQL_PASSWORD,MYSQL_HOSTNAME, MYSQL_PORT,MYSQL_DB} = process.env;

const pool = mysql.createPool({
    host: MYSQL_HOSTNAME,
    user: MYSQL_USERNAME,
    database: MYSQL_DB,
    password: MYSQL_PASSWORD,
    port: MYSQL_PORT,
});

pool.getConnection((err, connection) => {

    if( err ){
        if( err.code === 'PROTOCOL_CONNECTION_LOST' ) console.log('DATABASE CONNECTION WAS CLOSED');
        if( err.code === 'ER_CON_COUNT_ERROR' ) console.log('DATABASE HAS TO MANY CONNECTIONS');
        if( err.code === 'ECONNREFUSED' ) console.log('DATABASE CONNECTION WAS REFUSED');
        return;
    }

    if( connection ) connection.release();

    console.log(`DATABASE is connected to ${MYSQL_DB} ❤`);
    return;
});

pool.query = promisify( pool.query )

module.exports = pool;