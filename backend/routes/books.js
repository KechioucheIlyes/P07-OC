const express = require('express');
const booksCtrl = require("../controllers/books")
const authMiddleware = require("../middleware/auth")
const router = express.Router()
const multMiddleware = require("../middleware/multer-config")
const imageOptimizationMiddleware = require("../middleware/image-optimization")


router.get("/", booksCtrl.getAllBooks)
router.get("/bestrating", booksCtrl.getBestRating);
router.get("/:id", booksCtrl.getBookbyId)
router.put("/:id", authMiddleware, multMiddleware, booksCtrl.modifyBooks)
router.post("/:id/rating", authMiddleware, booksCtrl.ratingById)
router.post('/', authMiddleware, multMiddleware, imageOptimizationMiddleware, booksCtrl.createBook)
router.delete("/:id", authMiddleware, booksCtrl.deleteBook)

module.exports = router


