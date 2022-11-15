const express = require("express");
const RouteInformations = express.Router();
const connection = require("../config/configDB");
const mysql = require("mysql");
RouteInformations.use(express.json());
const Time = require("./dateTime");
const dateTime = Time.dateTime;
const TimeNow = Time.TimeNow;

//## Add PlantTrackings ##//
const addPlanttracking = async (req, res) => {
    const nameGreenHouse = req.body.nameGreenHouse;
    const CheckDate = req.body.CheckDate;
    const PotBarcode = req.body.PotBarcode;
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
    if (nameGreenHouse && CheckDate && PlantStatus && SoilMoisture) {
        connection.getConnection(async (err, connection) => {
            if (err) throw err;
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?";
            const searchGH_query = mysql.format(sqlSearchGH, [nameGreenHouse]);

            const sqlSearchPot = "SELECT * FROM pots WHERE Barcode = ?";
            const searchPot_query = mysql.format(sqlSearchPot, [PotBarcode]);

          

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
                        console.log("------> Search PotBarcode");
                        console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409)
                            res.send({ success: false, message: "ไม่พบหมายเลขกระถาง" });
                        } else {
                            console.log(result[0]["PotID"])
                            const sqlInsertPlantTracking =
                            "INSERT INTO plant_trackings (PotID,CheckDate,PlantStatus,SoilMoisture,SoilRemark,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?)";
                        const insertPlantTracking_query = mysql.format(sqlInsertPlantTracking, [
                            result[0]["PotID"],
                            CheckDateTime,
                            PlantStatus,
                            SoilMoisture,
                            SoilRemark,
                            Remark,
                            dateTime,
                            CreateBy,
                            dateTime,
                            UpdateBy,
                        ]);
                            await connection.query(
                                insertPlantTracking_query,
                                (err, result) => {
                                    connection.release();
                                    if (err) throw err;
                                    console.log("--------> The data was saved successfully.");
                                    console.log(result.insertId);

                                    if (Disease != "") {
                                        //disease_logs
                                        const sqlInsertdisease_logs =
                                            "INSERT INTO disease_logs (PlantTrackingID,Disease,Fix,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?)";
                                        const insertdiseaselogs_query = mysql.format(
                                            sqlInsertdisease_logs,
                                            [
                                                result.insertId,
                                                Disease,
                                                FixDisease,
                                                dateTime,
                                                CreateBy,
                                                dateTime,
                                                UpdateBy,
                                            ]
                                        );
                                        connection.query(insertdiseaselogs_query);
                                    }

                                    if (Insect != "") {
                                        //insect_logs
                                        const sqlInsertinsect_logs =
                                            "INSERT INTO insect_logs (PlantTrackingID,Insect,Fix,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?)";
                                        const insertinsectlogs_query = mysql.format(
                                            sqlInsertinsect_logs,
                                            [
                                                result.insertId,
                                                Insect,
                                                FixInsect,
                                                dateTime,
                                                CreateBy,
                                                dateTime,
                                                UpdateBy,
                                            ]
                                        );
                                        connection.query(insertinsectlogs_query);
                                    }

                                    if (Weight != "") {
                                        //trash_logs
                                        const sqlInserttrash_logs =
                                            "INSERT INTO trash_logs (PlantTrackingID,Weight,LogTime,TrashRemark,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?)";
                                        const inserttrashlogssquery = mysql.format(
                                            sqlInserttrash_logs,
                                            [
                                                result.insertId,
                                                Weight,
                                                LogTime + " " + TimeNow,
                                                TrashRemark,
                                                RemarkTrash_log,
                                                dateTime,
                                                CreateBy,
                                                dateTime,
                                                UpdateBy,
                                            ]
                                        );
                                        connection.query(inserttrashlogssquery);
                                    }

                                    //image_logs
                                    const sqlInsertimage_logs =
                                        "INSERT INTO image_logs (PlantTrackingID,FileName,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?)";
                                    const insertimage_logsquery = mysql.format(
                                        sqlInsertimage_logs,
                                        [
                                            result.insertId,
                                            ImageFileName,
                                            dateTime,
                                            CreateBy,
                                            dateTime,
                                            UpdateBy,
                                        ]
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
        "SELECT PPIDITG.*,c.No FROM(SELECT PPIDIT.*, g.Name GHName FROM (SELECT PPIDI.*,t.TrashLogID,t.Weight,t.LogTime,t.TrashRemark,t.Remark FROM(SELECT PPID.*,i.InsectLogID,i.Insect,i.Fix FixInsect FROM(SELECT PPI.*,d.DiseaseLogID,d.Disease,d.Fix FixDisease FROM (SELECT PTANDPOT.*,im.ImageID,im.FileName FROM (SELECT p.PlantTrackingID,p.CheckDate,p.PlantStatus,p.SoilMoisture,p.SoilRemark,p.Remark RemarkPlant,pots.PotID,pots.Name potsName,pots.GreenHouseID,pots.CultivationID,pots.Barcode,pots.IsTestPot,pots.Remark RemarkPot FROM plant_trackings p LEFT JOIN pots ON p.PotID = pots.PotID ) AS PTANDPOT LEFT JOIN image_logs im ON PTANDPOT.PlantTrackingID = im.PlantTrackingID ) AS PPI LEFT JOIN disease_logs d ON PPI.PlantTrackingID = d.PlantTrackingID) AS PPID LEFT JOIN insect_logs i ON PPID.PlantTrackingID = i.PlantTrackingID) AS PPIDI LEFT JOIN trash_logs t ON PPIDI.PlantTrackingID = t.PlantTrackingID) AS PPIDIT LEFT JOIN greenhouses g ON PPIDIT.GreenHouseID = g.GreenHouseID) AS PPIDITG LEFT JOIN  cultivations c ON PPIDITG.CultivationID = c.CultivationID WHERE Barcode = ? ORDER BY PlantTrackingID DESC;",
        [Barcode],
        function (err, results) {
            if (err) throw err;
            console.log(Barcode);
            console.log("------> Search Planttracking");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getPlanttrackingbyid = function (req, res) {
    const id = req.query.id;

    connection.query(
        "SELECT PPIDITG.*,c.No FROM(SELECT PPIDIT.*, g.Name GHName FROM (SELECT PPIDI.*,t.TrashLogID,t.Weight,t.LogTime,t.TrashRemark,t.Remark FROM(SELECT PPID.*,i.InsectLogID,i.Insect,i.Fix FixInsect FROM(SELECT PPI.*,d.DiseaseLogID,d.Disease,d.Fix FixDisease FROM (SELECT PTANDPOT.*,im.ImageID,im.FileName FROM (SELECT p.PlantTrackingID,p.CheckDate,p.PlantStatus,p.SoilMoisture,p.SoilRemark,p.Remark RemarkPlant,pots.PotID,pots.Name potsName,pots.GreenHouseID,pots.CultivationID,pots.Barcode,pots.IsTestPot,pots.Remark RemarkPot FROM plant_trackings p LEFT JOIN pots ON p.PotID = pots.PotID ) AS PTANDPOT LEFT JOIN image_logs im ON PTANDPOT.PlantTrackingID = im.PlantTrackingID ) AS PPI LEFT JOIN disease_logs d ON PPI.PlantTrackingID = d.PlantTrackingID) AS PPID LEFT JOIN insect_logs i ON PPID.PlantTrackingID = i.PlantTrackingID) AS PPIDI LEFT JOIN trash_logs t ON PPIDI.PlantTrackingID = t.PlantTrackingID) AS PPIDIT LEFT JOIN greenhouses g ON PPIDIT.GreenHouseID = g.GreenHouseID) AS PPIDITG LEFT JOIN  cultivations c ON PPIDITG.CultivationID = c.CultivationID WHERE PlantTrackingID = ?",
        [id],
        function (err, results) {
            if (err) throw err;

            console.log("------> Search Planttracking");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getCountDisease = function (req, res) {
    const culid = req.query.culid;
    connection.query(
        "SELECT CultivationID,COUNT(PotID) Count FROM (SELECT * FROM (SELECT CultivationID FROM `cultivations`) AS C LEFT JOIN (SELECT cultivations.CultivationID cid,pots.PotID FROM ((`cultivations` INNER JOIN pots ON cultivations.CultivationID=pots.CultivationID ) INNER JOIN plant_trackings ON pots.PotID=plant_trackings.PotID) INNER JOIN disease_logs ON plant_trackings.PlantTrackingID = disease_logs.PlantTrackingID WHERE disease_logs.Disease != 'ไม่พบ' GROUP BY pots.PotID) AS P ON C.CultivationID = P.cid) AS subquery WHERE CultivationID = ?",
        [culid],
        function (err, results) {
            if (err) throw err;

            console.log("------> CountDisease");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getCountInsect = function (req, res) {
    const culid = req.query.culid;
    connection.query(
        "SELECT CultivationID,COUNT(PotID) Count FROM (SELECT * FROM (SELECT CultivationID FROM `cultivations`) AS C LEFT JOIN (SELECT cultivations.CultivationID cid,pots.PotID FROM ((`cultivations` INNER JOIN pots ON cultivations.CultivationID=pots.CultivationID ) INNER JOIN plant_trackings ON pots.PotID=plant_trackings.PotID) INNER JOIN insect_logs ON plant_trackings.PlantTrackingID = insect_logs.PlantTrackingID WHERE insect_logs.Insect != 'ไม่พบ' GROUP BY pots.PotID) AS P ON C.CultivationID = P.cid) AS subquery WHERE CultivationID =?",
        [culid],
        function (err, results) {
            if (err) throw err;

            console.log("------> CountDisease");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
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
            if (err) throw err;
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?";
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName]);

            // ? will be replaced by values
            // ?? will be replaced by string
            connection.query(searchGH_query, async (err, result) => {
                if (err) throw err;
                console.log("------> Search GreenHouse");
                console.log(result.length);
                if (result.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409)
                    res.send({ success: false, message: "ไม่พบโรงเรือน" });
                } else {
                    //console.log(result[0]["GreenHouseID"])
                    const sqlInsert =
                        "INSERT INTO harvests (GreenHouseID,HarvestDate,HarvestNo,Type,Weight,LotNo,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                    const insert_query = mysql.format(sqlInsert, [
                        result[0]["GreenHouseID"],
                        HarvestDate + " " + TimeNow,
                        HarvestNo,
                        Type,
                        Weight,
                        LotNo,
                        Remark,
                        dateTime,
                        CreateBy,
                        dateTime,
                        UpdateBy,
                    ]);

                    await connection.query(insert_query, (err, result) => {
                        connection.release();
                        if (err) throw err;
                        console.log("-------->  The data was saved successfully.");
                        console.log(result.insertId);

                        res.send({
                            success: true,
                            message: "บันทึกข้อมูลเรียบร้อยแล้ว",
                            HarvestID: result.insertId,
                        });
                    });
                }
            });
        });
    } else {
        res.send({ ok: false, error: "Invalid data!" });
        console.log("---------> Invalid data!");
    }
};

const getHarvests = function (req, res) {
    connection.query(
        "SELECT harvests.*,greenhouses.Name NameGH FROM harvests  INNER JOIN greenhouses ON harvests.GreenHouseID=greenhouses.GreenHouseID ORDER BY harvests.HarvestID DESC",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Harvests ");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getHarvestsByID = function (req, res) {
    const ID = req.query.id;
    connection.query(
        "SELECT harvests.*,greenhouses.Name NameGH  FROM harvests  INNER JOIN greenhouses ON harvests.GreenHouseID=greenhouses.GreenHouseID WHERE harvests.HarvestID = ?",
        [ID],
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Harvests ");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

//## Edit Harvests By HarvestID ##//
const editHarvests = async (req, res) => {
    const HarvestID = req.body.HarvestID;
    // const GreenHouseName = req.body.GreenHouseName;
    const HarvestDate = req.body.HarvestDate;
    const HarvestNo = req.body.HarvestNo;
    const Type = req.body.Type;
    const Weight = req.body.Weight;
    const LotNo = req.body.LotNo;
    const Remark = req.body.Remark;
    const UpdateBy = req.body.UpdateBy;

    connection.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlSearch = "SELECT * FROM harvests WHERE HarvestID = ?";
        const search_query = mysql.format(sqlSearch, [HarvestID]);

        const sqlUpdate =
            "UPDATE harvests SET HarvestDate = ?, HarvestNo = ?,Type = ?,Weight = ?, LotNo = ?,Remark=?,UpdateBy=?, UpdateTime=?  WHERE  HarvestID = ?";
        const Update_query = mysql.format(sqlUpdate, [
            HarvestDate + " " + TimeNow,
            HarvestNo,
            Type,
            Weight,
            LotNo,
            Remark,
            UpdateBy,
            dateTime,
            HarvestID,
        ]);

        // ? will be replaced by values
        // ?? will be replaced by string
        connection.query(search_query, async (err, result) => {
            if (err) throw err;
            console.log("------> Search harvests");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409)
                res.send({ success: false, message: "ไม่พบข้อมูลการเก็บเกี่ยว" });
            } else {
                await connection.query(Update_query, (err, result) => {
                    connection.release();
                    if (err) throw err;
                    console.log("-------->  The data was saved successfully.");

                    res.send({ success: true, message: "แก้ไขข้อมูลเรียบร้อยแล้ว" });
                });
            }
        });
    });
};

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
    if (
        HarvestID &&
        TransferDate &&
        Type &&
        Weight &&
        LotNo &&
        GetByName &&
        GetByPlace
    ) {
        connection.getConnection(async (err, connection) => {
            if (err) throw err;
            const sqlSearch = "SELECT * FROM harvests WHERE HarvestID = ?";
            const search_query = mysql.format(sqlSearch, [HarvestID]);

            const sqlInsert =
                "INSERT INTO transfers (HarvestID,TransferDate,Type,Weight,LotNo,GetByName,GetByPlace,LicenseNo,LicensePlate,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            const insert_query = mysql.format(sqlInsert, [
                HarvestID,
                TransferDate + " " + TimeNow,
                Type,
                Weight,
                LotNo,
                GetByName,
                GetByPlace,
                LicenseNo,
                LicensePlate,
                Remark,
                dateTime,
                CreateBy,
                dateTime,
                UpdateBy,
            ]);

            // ? will be replaced by values
            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err) throw err;
                console.log("------> Search HarvestID");
                console.log(result.length);
                if (result.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409)
                    res.send({ success: false, message: "ไม่พบหมายเลขการปลูก" });
                } else {
                    await connection.query(insert_query, (err, result) => {
                        connection.release();
                        if (err) throw err;
                        console.log("-------->  The data was saved successfully.");
                        console.log(result.insertId);

                        res.send({
                            success: true,
                            message: "บันทึกข้อมูลเรียบร้อยแล้ว",
                            TransferID: result.insertId,
                        });
                    });
                }
            });
        });
    } else {
        res.send({ ok: false, error: "Invalid data!" });
        console.log("---------> Invalid data!");
    }
};

//## Edit Transfers By TransferID ##//
const editTransfers = async (req, res) => {
    const TransferID = req.body.TransferID;
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
    const UpdateBy = req.body.UpdateBy;

    connection.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlSearch = "SELECT * FROM transfers WHERE TransferID = ?";
        const search_query = mysql.format(sqlSearch, [TransferID]);

        const sqlUpdate =
            "UPDATE transfers SET HarvestID=?,TransferDate=?,Type=?,Weight=?,LotNo=?,GetByName=?,GetByPlace=?,LicenseNo=?,LicensePlate=?,Remark=?,UpdateTime=?,UpdateBy=? WHERE  TransferID = ?";
        const Update_query = mysql.format(sqlUpdate, [
            HarvestID,
            TransferDate + " " + TimeNow,
            Type,
            Weight,
            LotNo,
            GetByName,
            GetByPlace,
            LicenseNo,
            LicensePlate,
            Remark,
            dateTime,
            UpdateBy,
            TransferID,
        ]);

        // ? will be replaced by values
        // ?? will be replaced by string
        connection.query(search_query, async (err, result) => {
            if (err) throw err;
            console.log("------> Search transfers");
            console.log(result.length);
            if (result.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409)
                res.send({ success: false, message: "ไม่พบข้อมูลการส่งมอบ" });
            } else {
                await connection.query(Update_query, (err, result) => {
                    connection.release();
                    if (err) throw err;
                    console.log("-------->  The data was saved successfully.");
                    console.log(result.insertId);

                    res.send({ success: true, message: "แก้ไขข้อมูลเรียบร้อยแล้ว" });
                });
            }
        });
    });
};

const getTransfers = function (req, res) {
    connection.query(
        "SELECT transfers.*,harvests.HarvestNo FROM transfers INNER JOIN harvests ON transfers.HarvestID=harvests.HarvestID ORDER BY transfers.TransferID DESC;",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Transfers ");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getTransferByID = function (req, res) {
    const ID = req.query.id;
    connection.query(
        "SELECT transfers.*,harvests.HarvestNo FROM transfers INNER JOIN harvests ON transfers.HarvestID=harvests.HarvestID WHERE transfers.TransferID = ?",
        [ID],
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Transfer ");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

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
    if (
        GreenHouseName &&
        StrainName &&
        No &&
        SeedDate &&
        MoveDate &&
        SeedTotal &&
        SeedNet &&
        PlantTotal &&
        PlantLive &&
        PlantDead
    ) {
        connection.getConnection(async (err, connection) => {
            if (err) throw err;
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?";
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName]);

            const sqlSearchStrain = "SELECT * FROM strains WHERE Name = ?";
            const searchStrain_query = mysql.format(sqlSearchStrain, [StrainName]);

            // ?? will be replaced by string
            connection.query(searchGH_query, async (err, resultGH) => {
                if (err) throw err;
                console.log("------> Search Name GreenHouse");
                //console.log(resultGH.length);
                if (resultGH.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409)
                    res.send({ success: false, message: "ไม่พบโรงปลูก" });
                } else {
                    connection.query(searchStrain_query, async (err, result) => {
                        if (err) throw err;
                        console.log("------> Search Name Strain");
                        //console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409)
                            res.send({ success: false, message: "ไม่พบข้อมูลสายพันธุ์" });
                        } else {
                            //console.log(resultGH[0]["GreenHouseID"])
                            //console.log(result[0]["StrainID"])
                            const sqlInsert =
                                "INSERT INTO cultivations (GreenHouseID,StrainID,No,SeedDate,MoveDate,SeedTotal,SeedNet,PlantTotal,PlantLive,PlantDead,Remark,CreateTime,CreateBy ,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                            const insert_query = mysql.format(sqlInsert, [
                                resultGH[0]["GreenHouseID"],
                                result[0]["StrainID"],
                                No,
                                SeedDate + " " + TimeNow,
                                MoveDate + " " + TimeNow,
                                SeedTotal,
                                SeedNet,
                                PlantTotal,
                                PlantLive,
                                PlantDead,
                                Remark,
                                dateTime,
                                CreateBy,
                                dateTime,
                                UpdateBy,
                            ]);

                            connection.query(insert_query, async (err, result) => {
                                if (err) throw err;
                                console.log("-------->  The data was saved successfully.");

                                res.send({
                                    success: true,
                                    message: "บันทึกข้อมูลเรียบร้อยแล้ว",
                                    CultivationID: result.insertId,
                                });
                            });
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
const editCultivations = async (req, res) => {
    const CultivationID = req.body.CultivationID;
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
    //const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;

    connection.getConnection(async (err, connection) => {
        if (err) throw err;
        const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?";
        const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName]);

        const sqlSearchStrain = "SELECT * FROM strains WHERE Name = ?";
        const searchStrain_query = mysql.format(sqlSearchStrain, [StrainName]);

        // ?? will be replaced by string
        connection.query(searchGH_query, async (err, resultGH) => {
            if (err) throw err;
            console.log("------> Search Name GreenHouse");
            //console.log(resultGH.length);
            if (resultGH.length == 0) {
                connection.release();
                console.log("------> exists");
                //res.sendStatus(409)
                res.send({ success: false, message: "ไม่พบโรงปลูก" });
            } else {
                connection.query(searchStrain_query, async (err, result) => {
                    if (err) throw err;
                    console.log("------> Search Name Strain");
                    //console.log(result.length);
                    if (result.length == 0) {
                        connection.release();
                        console.log("------> exists");
                        //res.sendStatus(409)
                        res.send({ success: false, message: "ไม่พบข้อมูลสายพันธุ์" });
                    } else {
                        const sqlSearch =
                            "SELECT * FROM cultivations WHERE CultivationID = ?";
                        const search_query = mysql.format(sqlSearch, [CultivationID]);

                        const sqlUpdate =
                            "UPDATE cultivations SET GreenHouseID = ?, StrainID = ?,No = ?,SeedDate = ?, MoveDate = ?,SeedTotal=?, SeedNet=? ,PlantTotal = ?, PlantLive = ?,PlantDead = ? ,Remark=?,UpdateTime=?,UpdateBy=? WHERE  CultivationID = ?";
                        const Update_query = mysql.format(sqlUpdate, [
                            resultGH[0]["GreenHouseID"],
                            result[0]["StrainID"],
                            No,
                            SeedDate,
                            MoveDate,
                            SeedTotal,
                            SeedNet,
                            PlantTotal,
                            PlantLive,
                            PlantDead,
                            Remark,
                            TimeNow,
                            UpdateBy,
                            CultivationID,
                        ]);

                        // ? will be replaced by values
                        // ?? will be replaced by string
                        connection.query(search_query, async (err, result) => {
                            if (err) throw err;
                            console.log("------> Search Cultivation");
                            console.log(result.length);
                            if (result.length == 0) {
                                connection.release();
                                console.log("------> exists");
                                //res.sendStatus(409)
                                res.send({ success: false, message: "ไม่พบข้อมูลการปลูก" });
                            } else {
                                await connection.query(Update_query, (err, result) => {
                                    connection.release();
                                    if (err) throw err;
                                    console.log("-------->  The data was saved successfully.");

                                    res.send({
                                        success: true,
                                        message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    });
};

const getCultivationsByNameGH = function (req, res) {
    const NameGH = req.query.NameGH;

    connection.query(
        "SELECT cultivations.*,ROUND((PlantLive/PlantTotal)*100, 2) as 'PercentageLive', ROUND((PlantDead/PlantTotal)*100, 2) as 'PercentageDead',greenhouses.Name FROM cultivations INNER JOIN greenhouses ON cultivations.GreenHouseID=greenhouses.GreenHouseID WHERE greenhouses.Name = ?",
        [NameGH],
        function (err, results) {
            if (err) throw err;
            console.log(NameGH);
            console.log("------> Search Cultivations");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getAllCultivations = function (req, res) {
    connection.query(
        "SELECT cultivations.*,ROUND((PlantLive/PlantTotal)*100, 2) as 'PercentageLive', ROUND((PlantDead/PlantTotal)*100, 2) as 'PercentageDead',greenhouses.Name NameGH ,strains.Name NameStrains,strains.ShortName ,CONCAT('รอบปลูกที่ ',cultivations.No,' ','โรงปลูก ',greenhouses.Name) culGH FROM cultivations INNER JOIN greenhouses ON cultivations.GreenHouseID=greenhouses.GreenHouseID INNER JOIN strains ON cultivations.StrainID=strains.StrainID  ORDER BY cultivations.CultivationID DESC",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Cultivations");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getCultivationByID = function (req, res) {
    const ID = req.query.ID;
    connection.query(
        "SELECT cultivations.*,ROUND((PlantLive/PlantTotal)*100, 2) as 'PercentageLive', ROUND((PlantDead/PlantTotal)*100, 2) as 'PercentageDead',greenhouses.Name NameGH ,strains.Name NameStrains,strains.ShortName,CONCAT('รอบปลูกที่ ',cultivations.No,' ','โรงปลูก ',greenhouses.Name) culGH FROM cultivations INNER JOIN greenhouses ON cultivations.GreenHouseID=greenhouses.GreenHouseID INNER JOIN strains ON cultivations.StrainID=strains.StrainID WHERE cultivations.CultivationID = ?",
        [ID],
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Cultivations");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getCultivationByGH = function (req, res) {
    const gh = req.query.gh;
    connection.query(
        "SELECT * FROM(SELECT cultivations.*,greenhouses.Name NameGH ,strains.Name NameStrains,strains.ShortName FROM cultivations INNER JOIN greenhouses ON cultivations.GreenHouseID=greenhouses.GreenHouseID INNER JOIN strains ON cultivations.StrainID=strains.StrainID) AS C LEFT JOIN (SELECT CultivationID cid,GreenHouseID ghid,COUNT(GreenHouseID) amountpots FROM `pots` GROUP BY CultivationID) AS P ON CultivationID=cid WHERE GreenHouseID = ?",
        [gh],
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Cultivations");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getHarvestByGH = function (req, res) {
    const gh = req.query.gh;
    connection.query(
        "SELECT * FROM `harvests` LEFT JOIN transfers ON harvests.HarvestID=transfers.HarvestID WHERE GreenHouseID = ?",
        [gh],
        function (err, results) {
            if (err) throw err;
            console.log("------> Search");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getInfoCul = function (req, res) {
    connection.query(
        "SELECT * FROM(SELECT cultivations.*,greenhouses.Name NameGH ,strains.Name NameStrains,strains.ShortName FROM cultivations INNER JOIN greenhouses ON cultivations.GreenHouseID=greenhouses.GreenHouseID INNER JOIN strains ON cultivations.StrainID=strains.StrainID GROUP BY cultivations.GreenHouseID) AS C LEFT JOIN (SELECT CultivationID cid,GreenHouseID ghid,COUNT(GreenHouseID) amountpots FROM `pots` WHERE CultivationID IN ( SELECT MAX(CultivationID) FROM pots GROUP BY GreenHouseID )GROUP BY CultivationID DESC) AS P ON GreenHouseID=ghid",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

const getpotsandplant = function (req, res) {
    connection.query(
        "SELECT pot.* FROM (SELECT pots.PotID,pots.GreenHouseID,greenhouses.Name GHName,pots.Name,pots.Barcode,pots.CultivationID FROM `pots` JOIN greenhouses ON pots.GreenHouseID = greenhouses.GreenHouseID) AS pot INNER JOIN plant_trackings ON pot.PotID = plant_trackings.PotID GROUP BY pot.PotID",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search");
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists");
                //res.sendStatus(409)
                res.json(results);
            } else {
                res.json(results);
            }
            //res.json(results);
            //console.log('OK')
        }
    );
};

module.exports = {
    addPlanttracking,
    editPlanttracking,
    addHarvests,
    editHarvests,
    addTransfers,
    editTransfers,
    addCultivations,
    getCultivationsByNameGH,
    getHarvests,
    getPlanttracking,
    getPlanttrackingbyid,
    getAllCultivations,
    getCultivationByID,
    editCultivations,
    getHarvestsByID,
    getTransfers,
    getTransferByID,
    getCountDisease,
    getCountInsect,
    getCultivationByGH,
    getHarvestByGH,
    getInfoCul,
    getpotsandplant
};
