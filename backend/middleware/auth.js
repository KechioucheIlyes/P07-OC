const jwt = require("jsonwebtoken")
require("dotenv").config()


module.exports = (req, res, next) => {
    try {
        const headerAuth = req.headers.authorization
        const userAgent = req.headers['user-agent']
        console.log(userAgent)

        const token = headerAuth.split(" ")[1]
        const verificationToken = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = verificationToken.userId
        req.auth = { userId }

        next()
    }
    catch (err) {
        res.status(401).json({ message: "Authorisation refusée !" })
    }


}
