const UploadRouter = require('express').Router();
const upLoadsImageCannabis = require('../Controller/SaveImages')
UploadRouter.post("/uploadimage",upLoadsImageCannabis.single('image'),async function(req,res){
    const uploadFile = req.file;
    if(!uploadFile){
        res.json({success:false,error:"File not Upload"})
    }
    res.json({success:true,data: uploadFile})
})
module.exports = UploadRouter;