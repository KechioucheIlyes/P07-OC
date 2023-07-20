const sharp = require('sharp');
const fs = require("fs")
const imageOptimizationMiddleware = (req, res, next) => {
    if (!req.file) {
        console.log('LOL')
        return next();
    }

    const optimizedImagePath = `images/optimized_${req.file.filename}`;

    sharp(req.file.path)
        .webp({ lossless: false, effort: 0, quality: 20 })
        .resize(500, null)
        .toFile(optimizedImagePath)
        .then(() => {
            fs.unlinkSync(req.file.path)
            req.file.path = optimizedImagePath;
            next();
        })
        .catch(err => {
            console.error(err);
            next();
        });

};

module.exports = imageOptimizationMiddleware;
