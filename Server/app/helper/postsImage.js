const multer = require('multer');

const FILE_MAP_TYPE = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const isvalid = FILE_MAP_TYPE[file.mimetype]
        let uploadError = new Error('Invalid Type.');
        if(isvalid){
            uploadError = null
        }
        cb(uploadError,'uploads/posts')
    },
    filename:function(req,file,cb){
        const originalName = file.originalname.split(' ').join('-');
        const extension = FILE_MAP_TYPE[file.mimetype];
        cb(null,`${originalName}-${Date.now()}.${extension}`)
    }
})

const postImage = multer({storage:storage});

module.exports = postImage;