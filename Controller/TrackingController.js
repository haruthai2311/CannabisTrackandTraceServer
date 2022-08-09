const express = require("express");
const RouteInformations = express.Router();
const connection = require("../config/DB");
const mysql = require("mysql");
RouteInformations.use(express.json());
const Time = require('./dateTime')
const dateTime = Time.dateTime
const TimeNow = Time.TimeNow

//## Add PlantTrackings ##//
const addPlanttrackking = async (req, res) => {
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
    const CheckDateTime = CheckDate + " " + TimeNow;
    const Weight = req.body.Weight;
    const LogTime = req.body.LogTime;
    const TrashRemark = req.body.TrashRemark;
    const RemarkTrash_log = req.body.RemarkTrash_log;

    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (
        nameGreenHouse &&
        CheckDate &&
        PlantStatus &&
        SoilMoisture &&
        Disease &&
        FixDisease &&
        Insect &&
        FixInsect && Weight && LogTime && TrashRemark
    ) {
        connection.getConnection(async (err, connection) => {
            if (err) throw err;
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?";
            const searchGH_query = mysql.format(sqlSearchGH, [nameGreenHouse]);

            const sqlSearchPot = "SELECT * FROM pots WHERE PotID = ?";
            const searchPot_query = mysql.format(sqlSearchPot, [PotID]);

            //plant_trackings
            //const sqlInsertPlantTracking = "INSERT INTO plant_trackings (PotID,CheckDate,PlantStatus,SoilMoisture,SoilRemark,Remark,CreateTime,CreateBy,CreateTime,UpdateTime,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
            //เหลือรูปกับ Update By ,Create By
            const sqlInsertPlantTracking =
                "INSERT INTO plant_trackings (PotID,CheckDate,PlantStatus,SoilMoisture,SoilRemark,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,? OR NULL,? OR NULL,?,?)";
            const insertPlantTracking_query = mysql.format(sqlInsertPlantTracking, [
                PotID,
                CheckDateTime,
                PlantStatus,
                SoilMoisture,
                SoilRemark,
                Remark,
                dateTime,
                dateTime,
            ]);

            // ? will be replaced by values
            // ?? will be replaced by string
            connection.query(searchGH_query, async (err, result) => {
                if (err) throw err;
                console.log("------> Search GreenHouses");
                console.log(result.length);
                if (result.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409)
                    res.send({ success: false, message: "ไม่พบโรงเรือน" });
                } else {
                    connection.query(searchPot_query, async (err, result) => {
                        if (err) throw err;
                        console.log("------> Search PotID");
                        console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409)
                            res.send({ success: false, message: "ไม่พบหมายเลขกระถาง" });
                        } else {
                            await connection.query(
                                insertPlantTracking_query,
                                (err, result) => {
                                    connection.release();
                                    if (err) throw err;
                                    console.log("--------> The data was saved successfully.");
                                    console.log(result.insertId);
                                    const sqlInsertdisease_logs =
                                        "INSERT INTO disease_logs (PlantTrackingID,Disease,Fix,CreateTime,UpdateTime) VALUES (?,?,?,?,?)";
                                    const insertdiseaselogs_query = mysql.format(
                                        sqlInsertdisease_logs,
                                        [result.insertId, Disease, FixDisease, dateTime, dateTime]
                                    );
                                    connection.query(insertdiseaselogs_query);
                                    const sqlInsertinsect_logs =
                                        "INSERT INTO insect_logs (PlantTrackingID,Insect,Fix,CreateTime,UpdateTime) VALUES (?,?,?,?,?)";
                                    const insertinsectlogs_query = mysql.format(
                                        sqlInsertinsect_logs,
                                        [result.insertId, Insect, FixInsect, dateTime, dateTime]
                                    );
                                    connection.query(insertinsectlogs_query);
                                    const sqlInserttrash_logs =
                                        "INSERT INTO trash_logs (PlantTrackingID,Weight,LogTime,TrashRemark,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,? OR NULL,?,?)";
                                    const inserttrashlogssquery = mysql.format(
                                        sqlInserttrash_logs,
                                        [result.insertId, Weight, LogTime, TrashRemark, RemarkTrash_log, dateTime, dateTime]
                                    );
                                    connection.query(inserttrashlogssquery);

                                    res.send({
                                        success: true,
                                        message: "บันทึกข้อมูลเรียบร้อยแล้ว",
                                        PlantTrackingID: result.insertId,
                                    });
                                }
                            );
                        }
                    });
                }
            });
        });
    } else {
        res.send({ ok: false, error: "Invalid data!" });
        console.log("---------> Invalid data!");
    }
};

//## Edit PlantTrackings By PlantTrackingID ##//
const editPlanttracking = async (req, res) => {
    const PlantTrackingID = req.body.PlantTrackingID;
    const PlantStatus = req.body.PlantStatus;
    const SoilMoisture = req.body.SoilMoisture;
    const Remark = req.body.Remark;
    const SoilRemark = req.body.SoilRemark;
    const Disease = req.body.Disease;
    const FixDisease = req.body.FixDisease;
    const Insect = req.body.Insect;
    const FixInsect = req.body.FixInsect;
    const ImageFileName = req.body.ImageFileName;
    //const Password = req.body.password;
    //const confirmPassword = req.body.confirmPassword;

    //console.log(dateTime);
    connection.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlSearch = "SELECT * FROM plant_trackings WHERE PlantTrackingID = ?";
        const search_query = mysql.format(sqlSearch, [PlantTrackingID]);
        const sqlUpdate =
            "UPDATE plant_trackings SET PlantStatus = ?, SoilMoisture = ?,SoilRemark = ? OR NULL,Remark = ? OR NULL,UpdateTime = ?  WHERE PlantTrackingID = ?";
        const update_query = mysql.format(sqlUpdate, [
            PlantStatus,
            SoilMoisture,
            SoilRemark,
            Remark,
            dateTime,
            PlantTrackingID,
        ]);
        // ? will be replaced by values
        // ?? will be replaced by string
        await connection.query(search_query, async (err, result) => {
            if (err) throw err;
            console.log("------> Search PlantTrackingID");
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409)
                res.send({ success: false, message: "ไม่พบการบันทึกผลตวรจประจำวัน!" });
            } else {
                await connection.query(update_query, (err, result) => {
                    connection.release();
                    if (err) throw err;
                    console.log("--------> Update PlantTracking");
                    const sqlUpdatedisease_logs =
                        "UPDATE disease_logs SET Disease = ?, Fix = ?,UpdateTime = ?  WHERE PlantTrackingID = ?";
                    const Updatediseaselogs_query = mysql.format(sqlUpdatedisease_logs, [
                        Disease,
                        FixDisease,
                        dateTime,
                        PlantTrackingID,
                    ]);
                    connection.query(Updatediseaselogs_query);
                    const sqlUpdateinsect_logs =
                        "UPDATE insect_logs SET Insect = ?, Fix = ?,UpdateTime = ?  WHERE PlantTrackingID = ?";
                    const Updateinsectlogs_query = mysql.format(sqlUpdateinsect_logs, [
                        Insect,
                        FixInsect,
                        dateTime,
                        PlantTrackingID,
                    ]);
                    connection.query(Updateinsectlogs_query);

                    //res.sendStatus(201)
                    res.send({ success: true, message: "แก้ไขข้อมูลเรียบร้อยแล้ว" });
                });
            }
        });
    });
};

//## Add Harvests ##//
const addHarvests = async (req, res) => {
    const GreenHouseName = req.body.GreenHouseName;
    const HarvestDate = req.body.HarvestDate;
    const HarvestNo = req.body.HarvestNo;
    const Type = req.body.Type;
    const Weight = req.body.Weight;
    const LotNo = req.body.LotNo;
    const Remark = req.body.Remark;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (GreenHouseName && HarvestDate && HarvestNo && Type && Weight && LotNo) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?z"
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName])




            // ? will be replaced by values
            // ?? will be replaced by string
            connection.query(searchGH_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search GreenHouse");
                console.log(result.length);
                if (result.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'ไม่พบโรงเรือน' });
                }
                else {
                    //console.log(result[0]["GreenHouseID"])
                    const sqlInsert = "INSERT INTO harvests (GreenHouseID,HarvestDate,HarvestNo,Type,Weight,LotNo,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,?,?,? OR NULL,?,?)"
                    const insert_query = mysql.format(sqlInsert, [result[0]["GreenHouseID"], HarvestDate + " " + TimeNow, HarvestNo, Type, Weight, LotNo, Remark, dateTime, dateTime])

                    await connection.query(insert_query, (err, result) => {
                        connection.release();
                        if (err)
                            throw (err);
                        console.log("-------->  The data was saved successfully.");
                        console.log(result.insertId);


                        res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', HarvestID: result.insertId });
                    });

                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

//## Edit Harvests By HarvestID ##//
const editHarvests = async (req, res) => {
    const HarvestID = req.body.HarvestID;
    const GreenHouseID = req.body.GreenHouseID;
    const HarvestDate = req.body.HarvestDate;
    const HarvestNo = req.body.HarvestNo;
    const Type = req.body.Type;
    const Weight = req.body.Weight;
    const LotNo = req.body.LotNo;
    const Remark = req.body.Remark;


    connection.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM harvests WHERE HarvestID = ?"
        const search_query = mysql.format(sqlSearch, [HarvestID])


        const sqlUpdate = "UPDATE harvests SET HarvestDate = ?, HarvestNo = ?,Type = ?,Weight = ?, LotNo = ?,Remark=? OR NULL , UpdateTime=?  WHERE  HarvestID = ?"
        const Update_query = mysql.format(sqlUpdate, [HarvestDate + " " + TimeNow, HarvestNo, Type, Weight, LotNo, Remark, dateTime, HarvestID])


        // ? will be replaced by values
        // ?? will be replaced by string
        connection.query(search_query, async (err, result) => {
            if (err)
                throw (err);
            console.log("------> Search harvests");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบข้อมูลการเก็บเกี่ยว' });
            }
            else {
                await connection.query(Update_query, (err, result) => {
                    connection.release();
                    if (err)
                        throw (err);
                    console.log("-------->  The data was saved successfully.");



                    res.send({ success: true, message: 'แก้ไขข้อมูลเรียบร้อยแล้ว' });
                });

            }
        })
    })
}

//## Add Transfers ##//
const addTransfers = async (req, res) => {
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
    if (HarvestID && TransferDate && Type && Weight && LotNo && GetByName && GetByPlace) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM harvests WHERE HarvestID = ?"
            const search_query = mysql.format(sqlSearch, [HarvestID])

            const sqlInsert = "INSERT INTO transfers (HarvestID,TransferDate,Type,Weight,LotNo,GetByName,GetByPlace,LicenseNo,LicensePlate,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,?,?,?,? OR NULL,? OR NULL,? OR NULL,?,?)"
            const insert_query = mysql.format(sqlInsert, [HarvestID, TransferDate + " " + TimeNow, Type, Weight, LotNo, GetByName, GetByPlace, LicenseNo, LicensePlate, Remark, dateTime, dateTime])


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
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

//## Edit Transfers By TransferID ##//
const editTransfers = async (req, res) => {
    const TransferID = req.body.TransferID;
    const TransferDate = req.body.TransferDate;
    const Type = req.body.Type;
    const Weight = req.body.Weight;
    const LotNo = req.body.LotNo;
    const GetByName = req.body.GetByName;
    const GetByPlace = req.body.GetByPlace;
    const LicenseNo = req.body.LicenseNo;
    const LicensePlate = req.body.LicensePlate;
    const Remark = req.body.Remark;


    connection.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM transfers WHERE TransferID = ?"
        const search_query = mysql.format(sqlSearch, [TransferID])

        const sqlUpdate = "UPDATE transfers SET TransferDate=?,Type=?,Weight=?,LotNo=?,GetByName=?,GetByPlace=?,LicenseNo=? OR NULL,LicensePlate=? OR NULL,Remark=? OR NULL,UpdateTime=? WHERE  TransferID = ?"
        const Update_query = mysql.format(sqlUpdate, [TransferDate + " " + TimeNow, Type, Weight, LotNo, GetByName, GetByPlace, LicenseNo, LicensePlate, Remark, dateTime, TransferID])


        // ? will be replaced by values
        // ?? will be replaced by string
        connection.query(search_query, async (err, result) => {
            if (err)
                throw (err);
            console.log("------> Search transfers");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่พบข้อมูลการส่งมอบ' });
            }
            else {
                await connection.query(Update_query, (err, result) => {
                    connection.release();
                    if (err)
                        throw (err);
                    console.log("-------->  The data was saved successfully.");
                    console.log(result.insertId);


                    res.send({ success: true, message: 'แก้ไขข้อมูลเรียบร้อยแล้ว' });
                });

            }
        })
    })
}

//## Add Cultivations ##//
const addCultivations = async (req, res) => {
    const GreenHouseName = req.body.GreenHouseName;
    const StrainName = req.body.StrainName;
    const No = req.body.No;
    const SeedDate = req.body.SeedDate;
    const MoveDate = req.body.MoveDate;
    const SeedTotal = req.body.SeedTotal;
    const SeedNet = req.body.SeedNet;
    const PlantTotal = req.body.PlantTotal;
    const PlantLive = req.body.PlantLive;
    const PlantDead = req.body.PlantDead;
    const Remark = req.body.Remark;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (GreenHouseName && StrainName && No && SeedDate && MoveDate && SeedTotal && SeedNet && PlantTotal && PlantLive && PlantDead) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?"
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName])

            const sqlSearchStrain = "SELECT * FROM strains WHERE Name = ?"
            const searchStrain_query = mysql.format(sqlSearchStrain, [StrainName])

          

            // ?? will be replaced by string
            connection.query(searchGH_query, async (err, resultGH) => {
                if (err)
                    throw (err);
                console.log("------> Search Name GreenHouse");
                console.log(resultGH.length);
                if (resultGH.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'ไม่พบโรงปลูก' });
                }
                else {
                    connection.query(searchStrain_query, async (err, result) => {
                        if (err)
                            throw (err);
                        console.log("------> Search Name Strain");
                        //console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409) 
                            res.send({ success: false, message: 'ไม่พบข้อมูลสายพันธุ์' });
                        }
                        else {
                            //console.log(resultGH[0]["GreenHouseID"])
                            //console.log(result[0]["StrainID"])
                            const sqlInsert = "INSERT INTO cultivations (GreenHouseID,StrainID,No,SeedDate,MoveDate,SeedTotal,SeedNet,PlantTotal,PlantLive,PlantDead,Remark,CreateTime, UpdateTime) VALUES (?,?,?,?,?,?,?,?,?,?,? OR NULL,?,?)"
                            const insert_query = mysql.format(sqlInsert, [resultGH[0]["GreenHouseID"], result[0]["StrainID"], No, SeedDate + " " + TimeNow, MoveDate + " " + TimeNow, SeedTotal, SeedNet, PlantTotal, PlantLive, PlantDead, Remark, dateTime, dateTime])
                
                            connection.query(insert_query, async (err, result) => {
                                if (err)
                                    throw (err);
                                console.log("-------->  The data was saved successfully.");

                                res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', CultivationID: result.insertId });

                            });
                        }
                    })
                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

module.exports = { addPlanttrackking, editPlanttracking, addHarvests, editHarvests, addTransfers, editTransfers ,addCultivations};
