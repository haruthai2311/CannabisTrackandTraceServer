const express = require("express");
const RouteInformations = express.Router();
const connection = require("../config/configDB");
const mysql = require("mysql");
RouteInformations.use(express.json());
const Time = require('./dateTime')
const dateTime = Time.dateTime
const TimeNow = Time.TimeNow

//## Add PlantTrackings ##//
const addPlanttracking = async (req, res) => {
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
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;

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
                "INSERT INTO plant_trackings (PotID,CheckDate,PlantStatus,SoilMoisture,SoilRemark,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?)";
            const insertPlantTracking_query = mysql.format(sqlInsertPlantTracking, [
                PotID,
                CheckDateTime,
                PlantStatus,
                SoilMoisture,
                SoilRemark,
                Remark,
                dateTime, CreateBy,
                dateTime, UpdateBy
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

                                    //disease_logs
                                    const sqlInsertdisease_logs =
                                        "INSERT INTO disease_logs (PlantTrackingID,Disease,Fix,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?)";
                                    const insertdiseaselogs_query = mysql.format(
                                        sqlInsertdisease_logs,
                                        [result.insertId, Disease, FixDisease, dateTime, CreateBy, dateTime, UpdateBy]
                                    );
                                    connection.query(insertdiseaselogs_query);

                                    //insect_logs
                                    const sqlInsertinsect_logs =
                                        "INSERT INTO insect_logs (PlantTrackingID,Insect,Fix,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?)";
                                    const insertinsectlogs_query = mysql.format(
                                        sqlInsertinsect_logs,
                                        [result.insertId, Insect, FixInsect, dateTime, CreateBy, dateTime, UpdateBy]
                                    );
                                    connection.query(insertinsectlogs_query);

                                    //trash_logs
                                    const sqlInserttrash_logs =
                                        "INSERT INTO trash_logs (PlantTrackingID,Weight,LogTime,TrashRemark,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?)";
                                    const inserttrashlogssquery = mysql.format(
                                        sqlInserttrash_logs,
                                        [result.insertId, Weight, LogTime + " " + TimeNow, TrashRemark, RemarkTrash_log, dateTime, CreateBy, dateTime, UpdateBy]
                                    );
                                    connection.query(inserttrashlogssquery);

                                    //image_logs
                                    const sqlInsertimage_logs =
                                        "INSERT INTO image_logs (PlantTrackingID,FileName,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?)";
                                    const insertimage_logsquery = mysql.format(
                                        sqlInsertimage_logs,
                                        [result.insertId, ImageFileName, dateTime, CreateBy, dateTime, UpdateBy]
                                    );
                                    connection.query(insertimage_logsquery);

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

const getPlanttracking = function (req, res) {
    const Barcode = req.query.Barcode;

    connection.query(
        "SELECT p.PlantTrackingID,p.CheckDate,p.PlantStatus,p.SoilMoisture,p.SoilRemark,p.Remark,im.ImageID,im.FileName,d.DiseaseLogID,d.Disease,d.Fix FixDisease,i.InsectLogID,i.Insect,i.Fix FixInsect,t.TrashLogID,t.Weight,t.LogTime,t.TrashRemark,t.Remark,pots.PotID,pots.Name potsName,pots.GreenHouseID,g.Name GHName,pots.CultivationID,c.No,pots.Barcode,pots.IsTestPot,pots.Remark FROM plant_trackings p,image_logs im,disease_logs d,insect_logs i,trash_logs t,pots,greenhouses g,cultivations c WHERE p.PlantTrackingID=im.PlantTrackingID AND  p.PlantTrackingID=d.PlantTrackingID AND  p.PlantTrackingID=i.PlantTrackingID AND p.PlantTrackingID=t.PlantTrackingID AND pots.GreenHouseID = g.GreenHouseID AND c.CultivationID=pots.CultivationID AND p.PotID = pots.PotID AND pots.Barcode = ?", [Barcode],
        function (err, results) {
            if (err) throw err;
            console.log(Barcode)
            console.log("------> Search Planttracking")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists")
                //res.sendStatus(409) 
                res.json(results)
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        },
    );


}

const getPlanttrackingbyid = function (req, res) {
    const id = req.query.id;

    connection.query(
        "SELECT p.PlantTrackingID,p.CheckDate,p.PlantStatus,p.SoilMoisture,p.SoilRemark,p.Remark,im.ImageID,im.FileName,d.DiseaseLogID,d.Disease,d.Fix FixDisease,i.InsectLogID,i.Insect,i.Fix FixInsect,t.TrashLogID,t.Weight,t.LogTime,t.TrashRemark,t.Remark,pots.PotID,pots.Name potsName,pots.GreenHouseID,g.Name GHName,pots.CultivationID,c.No,pots.Barcode,pots.IsTestPot,pots.Remark FROM plant_trackings p,image_logs im,disease_logs d,insect_logs i,trash_logs t,pots,greenhouses g,cultivations c WHERE p.PlantTrackingID=im.PlantTrackingID AND  p.PlantTrackingID=d.PlantTrackingID AND  p.PlantTrackingID=i.PlantTrackingID AND p.PlantTrackingID=t.PlantTrackingID AND pots.GreenHouseID = g.GreenHouseID AND c.CultivationID=pots.CultivationID AND p.PotID = pots.PotID AND p.PlantTrackingID = ?", [id],
        function (err, results) {
            if (err) throw err;

            console.log("------> Search Planttracking")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists")
                //res.sendStatus(409) 
                res.json(results)
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        },
    );


}

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
    //const CheckDateTime = CheckDate + " " + TimeNow;
    const Weight = req.body.Weight;
    //const LogTime = req.body.LogTime;
    const TrashRemark = req.body.TrashRemark;
    const RemarkTrash_log = req.body.RemarkTrash_log;
    const UpdateBy = req.body.UpdateBy;

    //console.log(dateTime);
    connection.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlSearch = "SELECT * FROM plant_trackings WHERE PlantTrackingID = ?";
        const search_query = mysql.format(sqlSearch, [PlantTrackingID]);
        const sqlUpdate =
            "UPDATE plant_trackings SET PlantStatus = ?, SoilMoisture = ?,SoilRemark = ?,Remark = ?,UpdateTime = ? ,UpdateBy = ? WHERE PlantTrackingID = ?";
        const update_query = mysql.format(sqlUpdate, [
            PlantStatus,
            SoilMoisture,
            SoilRemark,
            Remark,
            dateTime,
            UpdateBy,
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


                    //disease_logs
                    const sqlUpdatedisease_logs =
                        "UPDATE disease_logs SET Disease = ?, Fix = ?,UpdateTime = ?,UpdateBy = ?  WHERE PlantTrackingID = ?";
                    const Updatediseaselogs_query = mysql.format(sqlUpdatedisease_logs, [
                        Disease,
                        FixDisease,
                        dateTime,
                        UpdateBy,
                        PlantTrackingID,
                    ]);
                    connection.query(Updatediseaselogs_query);

                    //insect_logs
                    const sqlUpdateinsect_logs =
                        "UPDATE insect_logs SET Insect = ?, Fix = ?,UpdateTime = ? ,UpdateBy = ? WHERE PlantTrackingID = ?";
                    const Updateinsectlogs_query = mysql.format(sqlUpdateinsect_logs, [
                        Insect,
                        FixInsect,
                        dateTime,
                        UpdateBy,
                        PlantTrackingID,
                    ]);
                    connection.query(Updateinsectlogs_query);


                    //trash_logs Remark = ?
                    const sqlUpdatetrash_logs =
                        "UPDATE trash_logs SET Weight = ?,TrashRemark = ?,UpdateTime = ? ,UpdateBy=? WHERE PlantTrackingID = ?";
                    const Updatetrashlogs_query = mysql.format(sqlUpdatetrash_logs, [
                        Weight,
                        TrashRemark,
                        RemarkTrash_log,
                        dateTime,
                        UpdateBy,
                        PlantTrackingID,
                    ]);
                    connection.query(Updatetrashlogs_query);

                    //image_logs
                    const sqlUpdateimage_logs =
                        "UPDATE image_logs SET FileName = ?, UpdateTime = ?,UpdateBy = ?  WHERE PlantTrackingID = ?";
                    const Updateimagelogs_query = mysql.format(sqlUpdateimage_logs, [
                        ImageFileName,
                        dateTime,
                        UpdateBy,
                        PlantTrackingID,
                    ]);
                    connection.query(Updateimagelogs_query);

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
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (GreenHouseName && HarvestDate && HarvestNo && Type && Weight && LotNo) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?"
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
                    const sqlInsert = "INSERT INTO harvests (GreenHouseID,HarvestDate,HarvestNo,Type,Weight,LotNo,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
                    const insert_query = mysql.format(sqlInsert, [result[0]["GreenHouseID"], HarvestDate + " " + TimeNow, HarvestNo, Type, Weight, LotNo, Remark, dateTime, CreateBy, dateTime, UpdateBy])

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

const getHarvests = function (req, res) {
    connection.query(
        "SELECT * FROM `harvests`",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Harvests ")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists")
                //res.sendStatus(409) 
                res.json(results)
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        }
    );

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


        const sqlUpdate = "UPDATE harvests SET HarvestDate = ?, HarvestNo = ?,Type = ?,Weight = ?, LotNo = ?,Remark=?, UpdateTime=?  WHERE  HarvestID = ?"
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
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (HarvestID && TransferDate && Type && Weight && LotNo && GetByName && GetByPlace) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM harvests WHERE HarvestID = ?"
            const search_query = mysql.format(sqlSearch, [HarvestID])

            const sqlInsert = "INSERT INTO transfers (HarvestID,TransferDate,Type,Weight,LotNo,GetByName,GetByPlace,LicenseNo,LicensePlate,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [HarvestID, TransferDate + " " + TimeNow, Type, Weight, LotNo, GetByName, GetByPlace, LicenseNo, LicensePlate, Remark, dateTime, CreateBy, dateTime, UpdateBy])


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


                        res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', TransferID: result.insertId });
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

        const sqlUpdate = "UPDATE transfers SET TransferDate=?,Type=?,Weight=?,LotNo=?,GetByName=?,GetByPlace=?,LicenseNo=?,LicensePlate=?,Remark=?,UpdateTime=? WHERE  TransferID = ?"
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
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;


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
                //console.log(resultGH.length);
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
                            const sqlInsert = "INSERT INTO cultivations (GreenHouseID,StrainID,No,SeedDate,MoveDate,SeedTotal,SeedNet,PlantTotal,PlantLive,PlantDead,Remark,CreateTime,CreateBy ,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
                            const insert_query = mysql.format(sqlInsert, [resultGH[0]["GreenHouseID"], result[0]["StrainID"], No, SeedDate + " " + TimeNow, MoveDate + " " + TimeNow, SeedTotal, SeedNet, PlantTotal, PlantLive, PlantDead, Remark, dateTime, CreateBy, dateTime, UpdateBy])

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

const getCultivations = function (req, res) {
    const NameGH = req.query.NameGH;

    connection.query(
        "SELECT cultivations.*,greenhouses.Name FROM cultivations INNER JOIN greenhouses ON cultivations.GreenHouseID=greenhouses.GreenHouseID WHERE greenhouses.Name = ?", [NameGH],
        function (err, results) {
            if (err) throw err;
            console.log(NameGH)
            console.log("------> Search Cultivations")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists")
                //res.sendStatus(409) 
                res.json(results)
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        },
    );


}

module.exports = { addPlanttracking, editPlanttracking, addHarvests, editHarvests, addTransfers, editTransfers, addCultivations, getCultivations, getHarvests, getPlanttracking, getPlanttrackingbyid };
