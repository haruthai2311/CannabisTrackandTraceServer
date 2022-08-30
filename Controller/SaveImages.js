const multer = require('multer');
const path = require('path');
const uuid = require('uuid');


var storageCannabis = multer.diskStorage({

    destination: function( req, res, cb ) {
        cb( null, './assets/ImagesUploaded')
    },
    filename: function(req, file, cb) {
        const originalName = file.originalname;
    
        cb(null,originalName);
    }

});

const upLoadsImageCannabis = multer({ storage: storageCannabis });

module.exports = upLoadsImageCannabis;


