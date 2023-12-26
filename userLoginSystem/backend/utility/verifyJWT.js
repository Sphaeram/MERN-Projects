import jwt from "jsonwebtoken"
import { config } from 'dotenv'

config()

export const verifyJWT = async (req, res, next) => {
    const authHeader = req.get('Authorization')
    // console.log(authHeader)
    if (!authHeader) return res.sendStatus(401)
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403)
            req.user = decoded.userEmail
            next()
        }
    )

}