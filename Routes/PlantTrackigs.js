'use strict';
const express = require('express');
const RouteTracking = express.Router();
const connection = require('../config/DB');
const mysql = require('mysql');
const md5 = require('md5');
RouteTracking.use(express.json());
const dateTime = require('./dateTime')
const TimeNow = require('./TimeNow')

RouteTracking.post("/planttrackings", async (req,res) => {
    const nameGreenHouse = req.body.nameGreenHouse;
    const CheckDate = req.body.CheckDate;
    const PotID = req.body.PotID;
    const PlantStatus = req.body.PlantStatus;
    const SoilMoisture = req.body.SoilMoisture;
    const Remark = req.body.Remark;
    const SoilRemark = req.body.SoilRemark;
    const Disease = req.body.Disease;
    const FixDisease = req.body.FixDisease;
    const Insect = req.body.Insect;
    const FixInsect = req.body.FixInsect;
    const ImageFileName = req.body.ImageFileName;
    const CheckDateTime = CheckDate+ " "+TimeNow;

    
  //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
  if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect){
    connection.getConnection( async (err, connection) => {
     if (err) throw (err)
     const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?"
     const searchGH_query = mysql.format(sqlSearchGH,[nameGreenHouse])
     const sqlSearchPot = "SELECT * FROM pots WHERE PotID = ?"
     const searchPot_query = mysql.format(sqlSearchPot,[PotID])
     
     //plant_trackings
     //const sqlInsertPlantTracking = "INSERT INTO plant_trackings (PotID,CheckDate,PlantStatus,SoilMoisture,SoilRemark,Remark,CreateTime,CreateBy,CreateTime,UpdateTime,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
    //เหลือรูปกับ Update By ,Create By
     const sqlInsertPlantTracking = "INSERT INTO plant_trackings (PotID,CheckDate,PlantStatus,SoilMoisture,SoilRemark,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,? OR NULL,? OR NULL,?,?)"
     const insertPlantTracking_query = mysql.format(sqlInsertPlantTracking,[PotID,CheckDateTime,PlantStatus,SoilMoisture,SoilRemark,Remark,dateTime,dateTime])

     
     // ? will be replaced by values
     // ?? will be replaced by string
     connection.query(searchGH_query, async (err, result) => {
            if (err)
                throw (err);
            console.log("------> Search GreenHouses");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบโรงเรือน' });
            }
            else {
                connection.query(searchPot_query, async (err, result) => {
                    if (err)
                        throw (err);
                    console.log("------> Search PotID");
                    console.log(result.length);
                    if (result.length == 0) {
                        connection.release();
                        console.log("------> exists");
                        //res.sendStatus(409) 
                        res.send({ success: false, message: 'ไม่พบหมายเลขกระถาง' });
                    }
                    else {
                        await connection.query(insertPlantTracking_query, (err, result) => {
                            connection.release();
                            if (err)
                                throw (err);
                            console.log("--------> The data was saved successfully.");
                            console.log(result.insertId);
                            const sqlInsertdisease_logs = "INSERT INTO disease_logs (PlantTrackingID,Disease,Fix,CreateTime,UpdateTime) VALUES (?,?,?,?,?)";
                            const insertdiseaselogs_query = mysql.format(sqlInsertdisease_logs, [result.insertId, Disease, FixDisease, dateTime, dateTime]);
                            connection.query(insertdiseaselogs_query);
                            const sqlInsertinsect_logs = "INSERT INTO insect_logs (PlantTrackingID,Insect,Fix,CreateTime,UpdateTime) VALUES (?,?,?,?,?)";
                            const insertinsectlogs_query = mysql.format(sqlInsertinsect_logs, [result.insertId, Insect, FixInsect, dateTime, dateTime]);
                            connection.query(insertinsectlogs_query); 

                            res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', PlantTrackingID: result.insertId });
                        });
                    }
                });
            }
        }) 
  }) 
  }else {
    res.send({ ok: false, error: 'Invalid data!'});
    console.log("---------> Invalid data!")
  }}) 

  RouteTracking.post("/harvests", async (req,res) => {
    const GreenHouseID = req.body.GreenHouseID;
    const HarvestDate = req.body.HarvestDate;
    const HarvestNo = req.body.HarvestNo;
    const Type = req.body.Type;
    const Weight = req.body.Weight;
    const LotNo = req.body.LotNo;
    const Remark = req.body.Remark;
 
    
  //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
  if (GreenHouseID&&HarvestDate&&HarvestNo&&Type&&Weight&&LotNo){
    connection.getConnection( async (err, connection) => {
     if (err) throw (err)
     const sqlSearchGH = "SELECT * FROM greenhouses WHERE GreenHouseID = ?"
     const searchGH_query = mysql.format(sqlSearchGH,[GreenHouseID])
    

     const sqlInsert = "INSERT INTO harvests (GreenHouseID,HarvestDate,HarvestNo,Type,Weight,LotNo,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,?,?,? OR NULL,?,?)"
     const insert_query = mysql.format(sqlInsert,[GreenHouseID,HarvestDate,HarvestNo,Type,Weight,LotNo,Remark,dateTime,dateTime])

     
     // ? will be replaced by values
     // ?? will be replaced by string
     connection.query(searchGH_query, async (err, result) => {
            if (err)
                throw (err);
            console.log("------> Search harvests");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบรอบการเก็บเกี่ยว' });
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release();
                    if (err)
                        throw (err);
                    console.log("-------->  The data was saved successfully.");
                    console.log(result.insertId);
                  

                    res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', PlantTrackingID: result.insertId });
                });
                    
            }
        }) 
  }) 
  }else {
    res.send({ ok: false, error: 'Invalid data!'});
    console.log("---------> Invalid data!")
  }}) 


  RouteTracking.post("/transfers", async (req,res) => {
    const HarvestID = req.body.HarvestID;
    const TransferDate = req.body.TransferDate;
    const Type = req.body.Type;
    const Weight = req.body.Weight;
    const LotNo = req.body.LotNo;
    const GetByName = req.body.GetByName;
    const GetByPlace = req.body.GetByPlace;
    const LicenseNo = req.body.LicenseNo;
    const LicensePlate = req.body.LicensePlate;
    const Remark = req.body.Remark;
 
    
  //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
  if (HarvestID&&TransferDate&&Type&&Weight&&LotNo&&GetByName&&GetByPlace){
    connection.getConnection( async (err, connection) => {
     if (err) throw (err)
     const sqlSearch = "SELECT * FROM harvests WHERE HarvestID = ?"
     const search_query = mysql.format(sqlSearch,[HarvestID])

     const sqlInsert = "INSERT INTO transfers (HarvestID,TransferDate,Type,Weight,LotNo,GetByName,GetByPlace,LicenseNo,LicensePlate,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,?,?,?,? OR NULL,? OR NULL,? OR NULL,?,?)"
     const insert_query = mysql.format(sqlInFuture<dynamic>sert,[HarvestID,TransferDate,Type,Weight,LotNo,GetByName,GetByPlace,LicenseNo,LicensePlate,Remark,dateTime,dateTime])

     
     // ? will be replaced by values
     // ?? will be replaced by string
     connection.query(search_query, async (err, result) => {
            if (err)
                throw (err);
            console.log("------> Search GreenHouses");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบโรงเรือน' });
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release();
                    if (err)
                        throw (err);
                    console.log("-------->  The data was saved successfully.");
                    console.log(result.insertId);
                  

                    res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', PlantTrackingID: result.insertId });
                });
                    
            }
        }) 
  }) 
  }else {
    res.send({ ok: false, error: 'Invalid data!'});
    console.log("---------> Invalid data!")
  }}) 



module.exports = RouteTracking;