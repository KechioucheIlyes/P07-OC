const mongoose = require('mongoose');


const book = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            grade: { type: Number }
        }
    ],
    averageRating: { type: Number },


})

module.exports = mongoose.model('book', book)


