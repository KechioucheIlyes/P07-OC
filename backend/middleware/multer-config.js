const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const nameWithoutOriginalFormat = file.originalname.split(' ').join('_').split(".png").join("_").split(".jpeg").join("_").split("jpg").join("_")
    console.log(nameWithoutOriginalFormat)
    const extension = MIME_TYPES[file.mimetype];
    callback(null, nameWithoutOriginalFormat + Date.now() + '.' + extension);
  }
});


module.exports = multer({storage: storage}).single('image');