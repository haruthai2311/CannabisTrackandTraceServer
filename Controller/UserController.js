const express = require('express');
const RouteUser = express.Router();
const connection = require('../config/configDB');
const mysql = require('mysql');
const md5 = require('md5');
RouteUser.use(express.json());
const Time = require('./dateTime')
const dateTime = Time.dateTime
const jwt = require('jsonwebtoken');


//## Register ##//
const addUser = async (req, res) => {
    const fnameT = req.body.fnameT;
    const lnameT = req.body.lnameT;
    const fnameE = req.body.fnameE;
    const lnameE = req.body.lnameE
    const email = req.body.email
    const username = req.body.username;
    const hashedPassword = await md5(req.body.password);
    const Password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    //console.log(dateTime);
    if (fnameT && lnameT && fnameE && lnameE && email && username && Password && confirmPassword) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM users WHERE Username = ?"
            const search_query = mysql.format(sqlSearch, [username])

            const sqlInsert = "INSERT INTO users (Username,Password,Email,FNameT,LNameT,FNameE,LNameE,IsDisabled,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [username, hashedPassword, email, fnameT, lnameT, fnameE, lnameE, 'N', dateTime, '', dateTime, ''])
            // ? will be replaced by values
            // ?? will be replaced by string
            await connection.query(search_query, async (err, result) => {
                if (err) throw (err)
                console.log("------> Search Results")
                console.log(result.length)
                if (result.length != 0) {
                    connection.release()
                    console.log("------> User already exists")
                    Controller / UserController.js                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว!' })
                }
                else {
                    if (Password == confirmPassword) {
                        await connection.query(insert_query, (err, result) => {
                            connection.release()
                            if (err) throw (err)
                            console.log("--------> Created new User")
                            console.log(result.insertId)
                            const sqlUpdate = "UPDATE users SET CreateBy= ?,UpdateBy = ?  WHERE UserID = ?"
                            const update_query = mysql.format(sqlUpdate, [result.insertId, result.insertId, result.insertId])

                            connection.query(update_query)

                            //res.sendStatus(201)
                            res.send({ success: true, message: 'สร้างบัญชีเรียบร้อยแล้ว', UserID: result.insertId })
                        })
                    } else {
                        res.send({ success: false, message: 'รหัสผ่านไม่ตรงกัน' })
                    }
                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

//## Login ##//
const User = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username)
    console.log(password)

    if (username && password) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "Select * from users where Username = ?"
            const search_query = mysql.format(sqlSearch, [username])
            await connection.query(search_query, async (err, result) => {
                connection.release()
                if (err) throw (err)
                if (result.length == 0) {
                    console.log(result.length)
                    console.log("--------> User does not exist")
                    //res.sendStatus(404)
                    res.send({ success: false, message: 'ชื่อผู้ใช้ไม่ถูกต้อง!' })
                }
                else {
                    const hashedPassword = await md5(password);
                    //onsole.log(result[0]['Password'])
                    //console.log(hashedPassword)
                    //get the hashedPassword from result
                    if (result[0]['Password'] == hashedPassword) {
                        const token = jwt.sign({ id: result[0]['UserID'] }, 'the-super-strong-secrect',)
                        console.log("---------> Login Successful")
                        res.send({ success: true, message: `${result[0]['FNameE']} ${result[0]['LNameE']} is logged in!`, token, user: result[0] })
                    }
                    else {
                        console.log("---------> Password Incorrect")
                        res.send({ success: false, message: 'รหัสผ่านไม่ถูกต้อง!' })
                    }
                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

//## Edit Profile ##//
const editProfile = async (req, res) => {
    const userid = req.body.userID
    const fnameT = req.body.fnameT;
    const lnameT = req.body.lnameT;
    const fnameE = req.body.fnameE;
    const lnameE = req.body.lnameE
    const email = req.body.email
    const username = req.body.username;
    const hashedPassword = await md5(req.body.password);
    //const Password = req.body.password;
    //const confirmPassword = req.body.confirmPassword;

    //console.log(dateTime);
    connection.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM users WHERE UserID = ?"
        const search_query = mysql.format(sqlSearch, [userid])

        const sqlUpdate = "UPDATE users SET Username = ?, Password = ?,Email = ?,FNameT = ?,LNameT = ?,FNameE = ?,LNameE = ?,UpdateTime = ?,UpdateBy = ?  WHERE UserID = ?"
        const update_query = mysql.format(sqlUpdate, [username, hashedPassword, email, fnameT, lnameT, fnameE, lnameE, dateTime, fnameT, userid])
        // ? will be replaced by values
        // ?? will be replaced by string
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("------> Search Results")
            if (result.length == 0) {
                connection.release()
                console.log("------> User already exists")
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบบัญชีนี้ในระบบ!' })
            }
            else {

                await connection.query(update_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    console.log("--------> Update User Information")
                    //res.sendStatus(201)
                    res.send({ success: true, message: 'แก้ไขข้อมูลเรียบร้อยแล้ว' })

                })
            }
        })
    })
}

//## Delete User Account By UserID ##//
const deleteUserByID = async (req, res) => {
    const userid = req.body.userID

    //console.log(dateTime);
    connection.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM users WHERE UserID = ?"
        const search_query = mysql.format(sqlSearch, [userid])

        const sqldelete = "DELETE FROM users WHERE  UserID = ?"
        const delete_query = mysql.format(sqldelete, [userid])
        // ? will be replaced by values
        // ?? will be replaced by string
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("------> Search Results")
            if (result.length == 0) {
                connection.release()
                console.log("------> User already exists")
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบบัญชีนี้ในระบบ!' })
            }
            else {
                await connection.query(delete_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    console.log("--------> Delete User")
                    //res.sendStatus(201)
                    res.send({ success: true, message: 'ลบข้อมูลเรียบร้อยแล้ว' })
                })
            }
        })
    })
}

const getUsers = function (req, res) {
    connection.query(
        'SELECT * FROM `users` ',
        function (err, results) {
            if (err) throw err;

            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> Users already exists")
                //res.sendStatus(409) 
                res.json({ success: false, message: 'ไม่มีข้อมูล!' })
            }
            else {
                console.log("------> Search Users")
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        }
    );

}


module.exports = { addUser, User, editProfile, deleteUserByID, getUsers }