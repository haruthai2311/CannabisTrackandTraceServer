const express = require('express');
const RouteInformations = express.Router();
RouteInformations.use(express.json());
const Infocontroller = require('../Controller/InfoController')


RouteInformations.post("/addStrains", Infocontroller.addStrains)
RouteInformations.get("/getStrains", Infocontroller.getStrains)


RouteInformations.post("/addLocations", Infocontroller.addLocations)


RouteInformations.post("/addGreenhouses", Infocontroller.addGreenhouses)
RouteInformations.get("/getAllGreenhouses", Infocontroller.getGreenhouses)


RouteInformations.post("/addPots", Infocontroller.addPots)
RouteInformations.get("/getPots",Infocontroller.getPots);


RouteInformations.post("/addInventorys", Infocontroller.addInventorys)
RouteInformations.get("/getInventorys", Infocontroller.getInventorys)


RouteInformations.post("/addChemicalUses", Infocontroller.addChemicalUses)


RouteInformations.get("/countcht",Infocontroller.countcht)



module.exports = RouteInformations;