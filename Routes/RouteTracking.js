const express = require('express');
const RouteTracking = express.Router();
RouteTracking.use(express.json());
const Trackingcontroller = require('../Controller/TrackingController')

RouteTracking.post("/planttrackings", Trackingcontroller.addPlanttracking);
RouteTracking.put("/editPlanttracking", Trackingcontroller.editPlanttracking);
RouteTracking.get("/getPlantracking",Trackingcontroller.getPlanttracking);
RouteTracking.get("/Plantracking",Trackingcontroller.getPlanttrackingbyid);

RouteTracking.get("/CountDisease",Trackingcontroller.getCountDisease);
RouteTracking.get("/CountInsect",Trackingcontroller.getCountInsect);

RouteTracking.post("/harvests", Trackingcontroller.addHarvests);
RouteTracking.put("/editHarvests", Trackingcontroller.editHarvests);
RouteTracking.get("/getHarvests",Trackingcontroller.getHarvests);
RouteTracking.get("/getHarvest",Trackingcontroller.getHarvestsByID);

RouteTracking.post("/transfers", Trackingcontroller.addTransfers);
RouteTracking.put("/editTransfers", Trackingcontroller.editTransfers);
RouteTracking.get("/getTransfers",Trackingcontroller.getTransfers);
RouteTracking.get("/getTransfer",Trackingcontroller.getTransferByID);

RouteTracking.post("/addCultivations", Trackingcontroller.addCultivations);
RouteTracking.put("/editCultivatiions",Trackingcontroller.editCultivations);
RouteTracking.get("/getCultivations",Trackingcontroller.getCultivationsByNameGH);
RouteTracking.get("/AllCultivations",Trackingcontroller.getAllCultivations);
RouteTracking.get("/Cultivation",Trackingcontroller.getCultivationByID);
RouteTracking.get("/Cultivations",Trackingcontroller.getCultivationByGH);
RouteTracking.get("/Harvests",Trackingcontroller.getHarvestByGH);
RouteTracking.get("/InfoCul",Trackingcontroller.getInfoCul);

RouteTracking.get("/Potslist",Trackingcontroller.getpotsandplant);

module.exports = RouteTracking;