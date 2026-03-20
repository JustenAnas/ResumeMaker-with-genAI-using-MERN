const multer = require("multer")

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:3*1024*10024 // 3Mb this means
    }
})

module.exports = upload