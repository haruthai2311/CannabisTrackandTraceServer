'use strict';
const express = require('express');
const RouteInformations = express.Router();
RouteInformations.use(express.json());
const Infocontroller = require('../Controller/InfoController')


RouteInformations.post("/addStrains", Infocontroller.addStrains)

RouteInformations.post("/addLocations", Infocontroller.addLocations)


RouteInformations.post("/addGreenhouses", Infocontroller.addGreenhouses)


RouteInformations.post("/addPots", Infocontroller.addPots)

RouteInformations.post("/addCultivations", Infocontroller.addCultivations)


RouteInformations.post("/addInventorys", Infocontroller.addInventorys)

RouteInformations.post("/addChemicalUses", Infocontroller.addChemicalUses)



module.exports = RouteInformations;