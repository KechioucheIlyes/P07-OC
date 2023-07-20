
const express = require('express');
const Book = require("../model/book")
const fs = require("fs")
const path = require("path")

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            const formattedBooks = books.map((book) => {
                return {
                    _id: book._id,
                    title: book.title,
                    author: book.author,
                    imageUrl: book.imageUrl,
                    year: book.year,
                    genre: book.genre,
                    rating: book.rating,
                    averageRating: book.averageRating,
                };
            });
            res.status(200).json(formattedBooks);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des livres." });
        });
};
exports.getBestRating = (req, res) => {

    Book.find()
        .then(books => {

            const bestRatingsBooks = books.slice(0, 3);
            res.json(bestRatingsBooks);

        })
        .catch(err => res.json(err));
}

exports.getBookbyId = (req, res) => {
    const bookId = req.params.id;

    Book.findOne({ _id: bookId })
        .then(book => {
            res.status(200).json(book);
            console.log(book.ratings)
        })
        .catch(err => {

            console.error(err);
            res.status(500).json({ message: "Une erreur s'est produite lors de la recherche du livre." });

        });
};




exports.createBook = (req, res, next) => {
    const userId = req.auth.userId
    const { book } = req.body
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    const parsedBook = JSON.parse(book)

    new Book({
        userId,
        title: parsedBook.title,
        author: parsedBook.author,
        year: parsedBook.year,
        genre: parsedBook.genre,
        ratings: [],
        averageRating: 0,
        imageUrl
    })
        .save()
        .then(() => {

            res.status(201).json({ message: "Livre enregistré avec succes !" })

        })
        .catch(err => console.log(err))

}

exports.modifyBooks = (req, res) => {
    const bookId = req.params.id;

    // Récupérer l'image d'origine du livre
    Book.findById(bookId)
        .then(book => {
            let image = book.imageUrl; // Récupérer l'URL de l'image d'origine

            // Vérifier si un nouveau fichier a été téléchargé
            if (req.file) {
                image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }

            // Continuer avec la mise à jour du livre
            if (req.body.book) {
                const parsedBook = JSON.parse(req.body.book);

                const modifyBook = {
                    title: parsedBook.title,
                    author: parsedBook.author,
                    year: parsedBook.year,
                    genre: parsedBook.genre,
                    imageUrl: image
                };

                Book.findByIdAndUpdate(bookId, modifyBook, { new: true })
                    .then(updatedBook => {
                        res.status(200).json({ message: 'Livre modifié avec succès.', book: updatedBook });
                    })
                    .catch(err => {
                        res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.' });
                    });
            } else {
                Book.findByIdAndUpdate(
                    bookId,
                    {
                        title: req.body.title,
                        author: req.body.author,
                        year: req.body.year,
                        genre: req.body.genre,
                        imageUrl: image
                    },
                    { new: true }
                )
                    .then(updatedBook => {
                        res.status(200).json({ message: 'Livre modifié avec succès.', book: updatedBook });
                    })
                    .catch(err => {
                        res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.' });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors de la récupération du livre.' });
        });
};


exports.deleteBook = (req, res) => {
    const bookId = req.params.id;

    Book.findByIdAndRemove(bookId)
        .then(book => {
            if (!book) {
                res.status(404).json({ message: "Livre introuvable !" });
                return;
            }

            const imagePath = path.join(__dirname, '..', book.imageUrl.split('http://localhost:4000/')[1]);

            console.log("IMAGE PATH:", imagePath)
            console.log("BOOK PATH:", book.imageUrl.split('http://localhost:4000/')[1])
            res.status(200).json({ message: "Livre supprimé avec succès !" });

            fs.rm(imagePath, (err) => {
                if (err) {
                    console.log("Un problème est survenu lors de la suppression du fichier", err);
                } else {
                    console.log("Fichier supprimé avec succès !");
                }
            });
        })
        .catch(err => console.log(err));
}









exports.ratingById = (req, res) => {
    console.log(req.params.id)
    const bookRating = req.body
    const bookId = req.params.id
    const userRate = bookRating.userId
    if (bookRating.rating >= 0 || bookRating.rating <= 5) {
        Book.findById(bookId)
            .then(book => {
                console.log(book)
                const userRating = book.ratings.find(user => user.userRate === userRate)
                if (userRating) {
                    console.log("User a deja noté ce livre !")
                    res.status(402).json({ message: "vous avez déjà noté ce livre !" })
                } else {
                    console.log("n'a toujours pas noté ce livre ! ")
                    book.ratings.push({ userId: userRate, grade: bookRating.rating });
                    // Calculer la note moyenne
                    let totalRating = 0;
                    for (const rating of book.ratings) {
                        totalRating += rating.grade;
                        console.log("GRADE", rating.grade)

                    }
                    const averageRating = totalRating / book.ratings.length;

                    // Mettre à jour la note moyenne
                    book.averageRating = averageRating;

                    return book.save();
                }
            })
            .then(book => {
                // Répondre avec le livre mis à jour
                res.json(book);
            })
            .catch(err => console.log(err))
    }
    else {
        res.status(401).json({ message: "La note doit être comprise entre 0 et 5" })
    }
}
