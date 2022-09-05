const express = require('express');
const RouteTracking = express.Router();
RouteTracking.use(express.json());
const Trackingcontroller = require('../Controller/TrackingController')

RouteTracking.post("/planttrackings", Trackingcontroller.addPlanttracking);
RouteTracking.put("/editPlanttracking", Trackingcontroller.editPlanttracking);
RouteTracking.get("/getPlantracking",Trackingcontroller.getPlanttracking);
RouteTracking.get("/Plantracking",Trackingcontroller.getPlanttrackingbyid);

RouteTracking.post("/harvests", Trackingcontroller.addHarvests);
RouteTracking.put("/editHarvests", Trackingcontroller.editHarvests);
RouteTracking.get("/getHarvests",Trackingcontroller.getHarvests);

RouteTracking.post("/transfers", Trackingcontroller.addTransfers);
RouteTracking.put("/editTransfers", Trackingcontroller.editTransfers);

RouteTracking.post("/addCultivations", Trackingcontroller.addCultivations);
RouteTracking.get("/getCultivations",Trackingcontroller.getCultivations);

module.exports = RouteTracking;