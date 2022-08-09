const express = require('express');
const RouteInformations = express.Router();
const connection = require('../config/DB');
const mysql = require('mysql');
RouteInformations.use(express.json());
const Time = require('./dateTime')
const dateTime = Time.dateTime
const TimeNow = Time.TimeNow

//## Add Strains ##//
const addStrains = async (req, res) => {
    const Name = req.body.Name;
    const ShortName = req.body.ShortName;
    const Remark = req.body.Remark;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (Name) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM strains WHERE Name = ?"
            const search_query = mysql.format(sqlSearch, [Name])

            const sqlInsert = "INSERT INTO strains (Name,ShortName,IsActive,Remark,CreateTime,UpdateTime) VALUES (?,? OR NULL,?,? OR NULL,?,?)"
            const insert_query = mysql.format(sqlInsert, [Name, ShortName, 'Y', Remark, dateTime, dateTime])


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


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (Name && SubDistrictID && DistrictID && ProvinceID && PostCode) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM locations WHERE Name = ?"
            const search_query = mysql.format(sqlSearch, [Name])
            console.log(dateTime)
            const sqlInsert = "INSERT INTO locations (Name, AddrNo, Moo, Road, SubDistrictID, DistrictID, ProvinceID, PostCode, Lat, `Long`, Telephone, IsActive, Remark, CreateTime, UpdateTime) VALUES (?,? OR NULL,? OR NULL,? OR NULL,?,?,?,?,? OR NULL,? OR NULL,? OR NULL,?,? OR NULL,?,?)"
            const insert_query = mysql.format(sqlInsert, [Name, AddrNo, Moo, Road, SubDistrictID, DistrictID, ProvinceID, PostCode, Lat, Long, Telephone, 'Y', Remark, dateTime, dateTime])


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


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (LocationID && Name) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM locations WHERE LocationID = ?"
            const search_query = mysql.format(sqlSearch, [LocationID])

            const sqlInsert = "INSERT INTO greenhouses (locationID,Name, IsActive, Remark, CreateTime, UpdateTime) VALUES (?,?,?,? OR NULL,?,?)"
            const insert_query = mysql.format(sqlInsert, [LocationID, Name, 'Y', Remark, dateTime, dateTime])


            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Location");
                console.log(result.length);
                if (result.length == 0) {
                    connection.release();
                    console.log("------> exists");
                    //res.sendStatus(409) 
                    res.send({ success: false, message: 'ไม่พบสถานที่' });
                }
                else {
                    connection.query(insert_query, async (err, result) => {
                        if (err)
                            throw (err);

                        res.send({ success: true, message: 'บันทึกข้อมูลเรียบร้อยแล้ว', GreenhouseID: result.insertId });

                    });
                }
            })
        })
    } else {
        res.send({ ok: false, error: 'Invalid data!' });
        console.log("---------> Invalid data!")
    }
}

const getGreenhouses = async (req, res) => {
    connection.getConnection(async (err, connection) => {
        if (err) throw (err)
        const search_query = mysql.format("SELECT * FROM `greenhouses` WHERE IsActive = 'Y'")


        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("------> Search Greenhouses")
            if (result.length == 0) {
                connection.release()
                console.log("------> Users already exists")
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่มีข้อมูล!' })
            }
            else {

                res.send({result })
                
            }
        })
    })

}

//## Add Pots ##//
const addPots = async (req, res) => {
    const GreenHouseID = req.body.GreenHouseID;
    const CultivationID = req.body.CultivationID;
    const Name = req.body.Name;
    const Barcode = req.body.Barcode;
    //const IsTestPot = req.body.IsTestPot;
    const Remark = req.body.Remark;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (GreenHouseID && CultivationID && Name && Barcode) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchGH = "SELECT * FROM greenhouses WHERE GreenHouseID = ?"
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseID])

            const sqlSearchCID = "SELECT * FROM cultivations WHERE CultivationID = ?"
            const searchCID_query = mysql.format(sqlSearchCID, [CultivationID])

            const sqlInsert = "INSERT INTO pots (GreenHouseID,CultivationID,Name,Barcode, IsTestPot, Remark, CreateTime, UpdateTime) VALUES (?,?,?,?,?,? OR NULL,?,?)"
            const insert_query = mysql.format(sqlInsert, [GreenHouseID, CultivationID, Name, Barcode, 'N', Remark, dateTime, dateTime])


            // ?? will be replaced by string
            connection.query(searchGH_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name GreenHouse");
                console.log(result.length);
                if (result.length == 0) {
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


const getStrains = async (req, res) => {
    connection.getConnection(async (err, connection) => {
        if (err) throw (err)
        const search_query = mysql.format("SELECT * FROM `strains` WHERE IsActive = 'Y'")


        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("------> Search Strains")
            if (result.length == 0) {
                connection.release()
                console.log("------> Users already exists")
                //res.sendStatus(409) 
                res.send({ success: false, message: 'ไม่มีข้อมูล!' })
            }
            else {

                res.send({result })
            }
        })
    })

}

//## Add Inventorys ##//
const addInventorys = async (req, res) => {
    const Name = req.body.Name;
    const CommercialName = req.body.CommercialName;


    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (Name) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "SELECT * FROM inventorys WHERE Name = ?"
            const search_query = mysql.format(sqlSearch, [Name])

            const sqlInsert = "INSERT INTO inventorys (Name,CommercialName,IsActive,CreateTime, UpdateTime) VALUES (?,? OR NULL,?,?,?)"
            const insert_query = mysql.format(sqlInsert, [Name, CommercialName, 'Y', dateTime, dateTime])


            // ?? will be replaced by string
            connection.query(search_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Inventorys");
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

//## Add ChemicalUses ##//
const addChemicalUses = async (req, res) => {
    const InventoryID = req.body.InventoryID;
    const UseAmount = req.body.UseAmount;
    const Unit = req.body.Unit;
    const UseRemark = req.body.UseRemark;
    const PHI = req.body.PHI;
    const GreenHouseID = req.body.GreenHouseID;
    const Remark = req.body.Remark;



    //if (nameGreenHouse&&CheckDate&&PlantStatus&&SoilMoisture&&Disease&&FixDisease&&Insect&&FixInsect&&ImageFileName){
    if (InventoryID && GreenHouseID && UseAmount && Unit && UseRemark) {
        connection.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearchInven = "SELECT * FROM inventorys WHERE InventoryID = ?"
            const searchInven_query = mysql.format(sqlSearchInven, [InventoryID])

            const sqlSearchGH = "SELECT * FROM greenhouses WHERE GreenHouseID = ?"
            const searchGH_query = mysql.format(sqlSearchGH, [GreenHouseID])

            const sqlInsert = "INSERT INTO chemical_uses (InventoryID,UseAmount,Unit,UseRemark,PHI,GreenHouseID,Remark,CreateTime,UpdateTime) VALUES (?,?,?,?,? OR NULL,?,? OR NULL,?,?)"
            const insert_query = mysql.format(sqlInsert, [InventoryID, UseAmount, Unit, UseRemark, PHI, GreenHouseID, Remark, dateTime, dateTime])


            // ?? will be replaced by string
            connection.query(searchInven_query, async (err, result) => {
                if (err)
                    throw (err);
                console.log("------> Search Name Inventorys");
                console.log(result.length);
                if (result.length == 0) {
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
                        console.log(result.length);
                        if (result.length == 0) {
                            connection.release();
                            console.log("------> exists");
                            //res.sendStatus(409) 
                            res.send({ success: false, message: 'ไม่พบข้อมูลโรงปลูก' });
                        }
                        else {
                            connection.query(insert_query, async (err, result) => {
                                if (err)
                                    throw (err);

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

module.exports = { addStrains, addLocations, addGreenhouses, addPots, addInventorys, addChemicalUses, getGreenhouses ,getStrains}


