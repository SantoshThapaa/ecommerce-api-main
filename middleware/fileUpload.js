const multer = require('multer')
// fs and path are inbuilt
// fs is used to read the folder and file
const fs = require('fs')
// path is used to read the filename and extension
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let fileDestination = 'public/uploads/'
        // check if directory exists
        if (!fs.existsSync(fileDestination)) {
            fs.mkdirSync(fileDestination, { recursive: true })
            cb(null, fileDestination)
        }
        else {
            cb(null, fileDestination)
        }
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        let fileName = path.basename(file.originalname, path.extname(file.originalname))
        // path.basename('downloads/abc.jpg','.jpg')
        // abc
        let ext = path.extname(file.originalname)
        // .jpg
        // create a unique name using date
        cb(null, fileName + '_' + Date.now() + ext)
        // abc_230706.jpg
    }
})

const imageFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|jfif|gif|webp|svg|JPG|JPEG|PNG|JFIF|GIF|WEBP|SVG)$/)){
        return cb(new Error('You can upload image file only'),false)
    }
    else{
        cb(null,true)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits:{
        fileSize: 2097152 // 2MB
    }
})

module.exports = upload