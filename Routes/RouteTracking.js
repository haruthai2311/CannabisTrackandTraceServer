'use strict';
const express = require('express');
const RouteTracking = express.Router();
RouteTracking.use(express.json());
const Trackingcontroller = require('../Controller/TrackingController')

RouteTracking.post("/planttrackings", Trackingcontroller.addPlanttrackking);
RouteTracking.put("/editPlanttracking", Trackingcontroller.editPlanttracking);

RouteTracking.post("/harvests", Trackingcontroller.addHarvests);
RouteTracking.put("/editHarvests", Trackingcontroller.editHarvests);

RouteTracking.post("/transfers", Trackingcontroller.addTransfers);
RouteTracking.put("/editTransfers", Trackingcontroller.editTransfers)


module.exports = RouteTracking;