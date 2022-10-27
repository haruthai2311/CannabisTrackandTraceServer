const express = require('express');
const RouteUser = express.Router();
RouteUser.use(express.json());
const Usercontroller = require('../Controller/UserController')

RouteUser.post("/register", Usercontroller.addUser);
RouteUser.post("/login", Usercontroller.User);
RouteUser.put("/editProfile", Usercontroller.editProfile);
RouteUser.delete("/deleteuser", Usercontroller.deleteUserByID);

RouteUser.get('/getAllUsers',Usercontroller.getUsers);
RouteUser.get('/getUserbyid',Usercontroller.getUserbyid);

module.exports = RouteUser;