const express = require('express');
const RouteInformations = express.Router();
const connection = require('../config/configDB');
const mysql = require('mysql');
RouteInformations.use(express.json());
const Time = require('./dateTime')
const dateTime = Time.dateTime
const TimeNow = Time.TimeNow

//## Add Strains ##//
const addStrains = async (req, res) => {
    const Name = req.body.Name;
    const ShortName = req.body.ShortName;
    const IsActive = req.body.IsActive;
    const Remark = req.body.Remark;
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (Name) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM strains WHERE Name = ?"
            const search_query = mysql.format(sqlSearch, [Name])

            const sqlInsert = "INSERT INTO strains (Name,ShortName,IsActive,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [Name, ShortName, IsActive, Remark, dateTime, CreateBy, dateTime, UpdateBy])


            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Strain");
                console.log(result.length);
                if (result.length != 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'มีข้อมูลในระบบแล้ว' });
                }
                else {
                    connection.query(insert_query, async (err, result) => {
                        if (err)
                            throw (err);

                        res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', StrainID: result.insertId });

                    });
                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

//## Add Locations ##//
const addLocations = async (req, res) => {
    const Name = req.body.Name;
    const AddrNo = req.body.AddrNo;
    const Moo = req.body.Moo;
    const Road = req.body.Road;
    const SubDistrictID = req.body.SubDistrictID;
    const DistrictID = req.body.DistrictID;
    const ProvinceID = req.body.ProvinceID;
    const PostCode = req.body.PostCode;
    const Lat = req.body.Lat;
    const Long = req.body.Long;
    const Telephone = req.body.Telephone;
    const Remark = req.body.Remark;
    const IsActive = req.body.IsActive;
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy


    //ได้แต่มันซับซ้อนเกินไป
    // if (typeof Lat === 'string' && Lat.trim().length === 0) {
    //     const lat ='NUL'
    //   console.log(lat);
    // } else {
    //     const lat =Lat
    //     console.log(lat);
    //   console.log('string is NOT empty');
    // }

    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (Name && SubDistrictID && DistrictID && ProvinceID && PostCode) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM locations WHERE Name = ?"
            const search_query = mysql.format(sqlSearch, [Name])
            console.log(dateTime)
            // const sqlInsert = "INSERT INTO locations (Name, AddrNo, Moo, Road, SubDistrictID, DistrictID, ProvinceID, PostCode, Lat, `Long`, Telephone, IsActive, Remark, CreateTime,CreateBy,UpdateTime,UpdateBy ) VALUES (?,? OR NULL,? OR NULL,? OR NULL,?,?,?,?,? OR NULL,? OR NULL,? OR NULL,?,? OR NULL,?,?,?,?)"
            // const insert_query = mysql.format(sqlInsert, [Name, AddrNo, Moo, Road, SubDistrictID, DistrictID, ProvinceID, PostCode, Lat, Long, Telephone, 'Y', Remark, dateTime, CreateBy,dateTime,UpdateBy ])

            const sqlInsert = "INSERT INTO locations (Name, AddrNo, Moo, Road, SubDistrictID, DistrictID, ProvinceID, PostCode, Lat, `Long`, Telephone, IsActive, Remark, CreateTime,CreateBy,UpdateTime,UpdateBy ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [Name, AddrNo, Moo, Road, SubDistrictID, DistrictID, ProvinceID, PostCode, Lat, Long, Telephone, IsActive, Remark, dateTime, CreateBy, dateTime, UpdateBy])


            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Location");
                console.log(result.length);
                if (result.length != 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'มีข้อมูลในระบบแล้ว' });
                }
                else {
                    connection.query(insert_query, async (err, result) => {
                        if (err)
                            throw (err);

                        res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', LocationID: result.insertId });

                    });
                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

//## Add Greenhouses ##//
const addGreenhouses = async (req, res) => {
    const LocationID = req.body.LocationID;
    const Name = req.body.Name;
    const Remark = req.body.Remark;
    const IsActive = req.body.IsActive;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (LocationID && Name) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM locations WHERE LocationID = ?"
            const search_query = mysql.format(sqlSearch, [LocationID])

            const sqlSearchName = "SELECT * FROM greenhouses WHERE Name = ?"
            const searchName_query = mysql.format(sqlSearchName, [Name])

            const sqlInsert = "INSERT INTO greenhouses (locationID,Name, IsActive, Remark, CreateTime, UpdateTime) VALUES (?,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [LocationID, Name, IsActive, Remark, dateTime, dateTime])


            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Greenhouses");
                console.log(result.length);
                if (result.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'ไม่พบสถานที่' });
                }
                else {
                    connection.query(searchName_query, async (err, result) => {
                        if (err)
                            throw (err);
                        console.log("------> Search Name Location");
                        console.log(result.length);
                        if (result.length != 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409) 
                            res.send({ success: false, message: 'มีข้อมูลในระบบแล้ว' });
                        }
                        else {
                            connection.query(insert_query, async (err, result) => {
                                if (err)
                                    throw (err);

                                res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', GreenhouseID: result.insertId });

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

const getGreenhouses = function (req, res) {
    connection.query(
        "SELECT * FROM `greenhouses` WHERE IsActive = 'Y'",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Greenhouses")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------> exists")
                //res.sendStatus(409) 
                res.json({ success: false, message: 'ไม่มีข้อมูล!' })
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        }
    );

}

//## Add Pots ##//
const addPots = async (req, res) => {
    const GreenHouseName = req.body.GreenHouseName;
    const CultivationID = req.body.CultivationID;
    const Name = req.body.Name;
    const Barcode = req.body.Barcode;
    const IsTestPot = req.body.IsTestPot;
    const Remark = req.body.Remark;
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (GreenHouseName && CultivationID && Name && Barcode) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?"
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName])

            const sqlSearchCID = "SELECT * FROM cultivations WHERE CultivationID = ?"
            const searchCID_query = mysql.format(sqlSearchCID, [CultivationID])


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
                    connection.query(searchCID_query, async (err, result) => {
                        if (err)
                            throw (err);
                        console.log("------> Search Name Cultivation");
                        console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409) 
                            res.send({ success: false, message: 'ไม่พบรอบการปลูก' });
                        }
                        else {
                            //console.log(resultGH[0]["GreenHouseID"])
                            const sqlInsert = "INSERT INTO pots (GreenHouseID,CultivationID,Name,Barcode, IsTestPot, Remark, CreateTime,CreateBy, UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?)"
                            const insert_query = mysql.format(sqlInsert, [resultGH[0]["GreenHouseID"], CultivationID, Name, Barcode, IsTestPot, Remark, dateTime,CreateBy, dateTime,UpdateBy])


                            connection.query(insert_query, async (err, result) => {
                                if (err)
                                    throw (err);

                                res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', PotID: result.insertId });

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


const getStrains = function (req, res) {
    connection.query(
        "SELECT * FROM `strains` WHERE IsActive = 'Y' ",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Strains")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------>exists")
                //res.sendStatus(409) 
                res.json({ success: false, message: 'ไม่มีข้อมูล!' })
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        }
    );


}

//## Add Inventorys ##//
const addInventorys = async (req, res) => {
    const Name = req.body.Name;
    const CommercialName = req.body.CommercialName;
    const IsActive = req.body.IsActive;
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (Name) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM inventorys WHERE Name = ?"
            const search_query = mysql.format(sqlSearch, [Name])

            const sqlInsert = "INSERT INTO inventorys (Name,CommercialName,IsActive,CreateTime,CreateBy, UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [Name, CommercialName, IsActive, dateTime, CreateBy, dateTime, UpdateBy])


            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Inventorys");
                //console.log(result.length);
                if (result.length != 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'มีข้อมูลในระบบแล้ว' });
                }
                else {
                    connection.query(insert_query, async (err, result) => {
                        if (err)
                            throw (err);

                        res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', CultivationID: result.insertId });

                    });

                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

const getInventorys = function (req, res) {
    connection.query(
        "SELECT * FROM `inventorys` WHERE `IsActive`='y';",
        function (err, results) {
            if (err) throw err;
            console.log("------> Search Inventory")
            //console.log(results.length)
            if (results.length == 0) {
                console.log("------>exists")
                //res.sendStatus(409) 
                res.json({ success: false, message: 'ไม่มีข้อมูล!' })
            }
            else {
                res.json(results)
            }
            //res.json(results);
            //console.log('OK')
        }
    );


}

//## Add ChemicalUses ##//
const addChemicalUses = async (req, res) => {
    const InventoryName = req.body.InventoryName;
    const UseAmount = req.body.UseAmount;
    const Unit = req.body.Unit;
    const UseRemark = req.body.UseRemark;
    const PHI = req.body.PHI;
    const GreenHouseName = req.body.GreenHouseName;
    const Remark = req.body.Remark;
    const CreateBy = req.body.CreateBy;
    const UpdateBy = req.body.UpdateBy;



    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (InventoryName && GreenHouseName && UseAmount && Unit && UseRemark) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchInven = "SELECT * FROM inventorys WHERE Name = ?"
            const searchInven_query = mysql.format(sqlSearchInven, [InventoryName])

            const sqlSearchGH = "SELECT * FROM greenhouses WHERE Name = ?"
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseName])

            // ?? will be replaced by string
            connection.query(searchInven_query, async (err, resultInven) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Inventorys");
                //console.log(resultInven.length);
                if (resultInven.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'ไม่พบข้อมูลวัสดุ' });
                }
                else {
                    connection.query(searchGH_query, async (err, result) => {
                        if (err)
                            throw (err);
                        console.log("------> Search Name GreenHouses");
                        //console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409) 
                            res.send({ success: false, message: 'ไม่พบข้อมูลโรงปลูก' });
                        }
                        else {
                            // console.log(resultInven[0]["InventoryID"])
                            // console.log(result[0]["GreenHouseID"])
                            const sqlInsert = "INSERT INTO chemical_uses (InventoryID,UseAmount,Unit,UseRemark,PHI,GreenHouseID,Remark,CreateTime,CreateBy,UpdateTime,UpdateBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
                            const insert_query = mysql.format(sqlInsert, [resultInven[0]["InventoryID"], UseAmount, Unit, UseRemark, PHI + " " + TimeNow, result[0]["GreenHouseID"], Remark, dateTime, CreateBy, dateTime, UpdateBy])
                            connection.query(insert_query, async (err, result) => {
                                if (err)
                                    throw (err);
                                console.log("-------->  The data was saved successfully.");
                                res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', ChemicalUseID: result.insertId });

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

module.exports = { addStrains, addLocations, addGreenhouses, addPots, addInventorys, addChemicalUses, getGreenhouses, getStrains, getInventorys }


