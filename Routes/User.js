'use strict';
const express = require('express');
const RouteUser = express.Router();
const connection = require('../config/DB');
const bcrypt = require("bcrypt");
const mysql = require('mysql');
const md5 = require('md5');
const { OK } = require('http-status');
RouteUser.use(express.json());

RouteUser.post("/register", async (req,res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const hashedPassword = await md5(req.body.password);
    const Password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    connection.getConnection( async (err, connection) => {
     if (err) throw (err)
     const sqlSearch = "SELECT * FROM users WHERE username = ?"
     const search_query = mysql.format(sqlSearch,[username])
     const sqlInsert = "INSERT INTO users (fname, lname, username, password) VALUES (?,?,?,?)"
     const insert_query = mysql.format(sqlInsert,[fname, lname,username,hashedPassword])
     // ? will be replaced by values
     // ?? will be replaced by string
     await connection.query (search_query, async (err, result) => {
      if (err) throw (err)
      console.log("------> Search Results")
      console.log(result.length)
      if (result.length != 0) {
       connection.release()
       console.log("------> User already exists")
       //res.sendStatus(409) 
       res.send({ ok: true, message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว!'})
      } 
      else {
        if(Password==confirmPassword){
       await connection.query (insert_query, (err, result)=> {
       connection.release()
       if (err) throw (err)
       console.log ("--------> Created new User")
       console.log(result.insertId)
       //res.sendStatus(201)
       res.send({ ok: true, message: 'Created new User!',UserID:result.insertId})
       
      })}else{
        res.send({ ok: false, message: 'รหัสผ่านไม่ตรงกัน'})
      }
     }
    }) //end of connection.query()
    }) //end of db.getConnection()
    }) //end of app.post()

    //LOGIN (AUTHENTICATE USER)
RouteUser.post("/login", (req, res)=> {
    const username = req.body.username
    const password = req.body.password
    
    connection.getConnection ( async (err, connection)=> {
     if (err) throw (err)
     const sqlSearch = "Select * from users where username = ?"
     const search_query = mysql.format(sqlSearch,[username])
     await connection.query (search_query, async (err, result) => {
      connection.release()
      
      if (err) throw (err)
      if (result.length == 0) {
       console.log(result.length)
       console.log("--------> User does not exist")
       //res.sendStatus(404)
       res.send({ ok: false, message: 'Username not found!'})
      } 
      else {
      
         console.log(result[0]['password'])
         //get the hashedPassword from result
        if (result[0]['password']==md5(password)) {
        
        console.log("---------> Login Successful")
        res.send(`${result[0]['fname']} ${result[0]['lname']} is logged in!`)
        } 
        else {
        console.log("---------> Password Incorrect")
        res.send("Password incorrect!")
        } //end of bcrypt.compare()
      }//end of User exists i.e. results.length==0
     }) //end of connection.query()
    }) //end of db.connection()
    }) //end of app.post()
module.exports = RouteUser;