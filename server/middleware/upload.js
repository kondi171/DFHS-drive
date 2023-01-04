const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        callback(null, true)
        console.log('uploaded');
    },
    limits: {
        fileSize: 1024 * 1024 * 2000
    }
});

module.exports = upload;