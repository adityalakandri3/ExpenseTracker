const multer = require('multer');
const path = require('path')
const fs = require('fs')



const FILE_MAP_TYPE = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const isValid = FILE_MAP_TYPE[file.mimetype];
        let uploadError = new Error('Invalid image type');
        if(isValid){
            uploadError = null
        }
        cb(uploadError,'uploads/admin');
    },
    filename:function(req,file,cb){
        const filename = file.originalname.split(' ').join('-');
        const extension = FILE_MAP_TYPE[file.mimetype];
        cb(null,`${filename}-${Date.now()}.${extension}`)
    }
})

const adminImage = multer({storage:storage});


module.exports = adminImage;