import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).lean()
        if (user) return res.status(409).json({ msg: 'Email Already Registered!' })
        if (password.length < 6) return res.status(403).json({ msg: 'Password must be atleat 6 Characters Long!' })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            email: email.toLowerCase(),
            password: hash
        })
        await newUser.save()
        res.sendStatus(200)

    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }

}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.status(404).json({ msg: 'Email NOT Registered!' })
        if (password.length < 6) return res.status(403).json({ msg: 'Password must be atleat 6 Characters Long!' })

        try {
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) {
                return res.status(401).json({ msg: 'Invalid Credentials' })
            }
        } catch (error) {
            next(error)
        }

        const accessToken = jwt.sign(
            { 'userEmail': user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        )
        const refreshToken = jwt.sign(
            { 'userEmail': user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1h' }
        )

        await User.findOneAndUpdate({ email: user.email }, { $set: { refreshToken: refreshToken } })

        res.cookie('jwt', refreshToken, {
            path: '/',
            sameSite: 'strict',
            httpOnly: true,
            Secrue: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            email: user.email,
            accessToken: accessToken
        })

    } catch (error) {
        next(error)
    }
}

export const logOut = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const user = await User.findOne({ refreshToken: refreshToken })
    if (!user || user === undefined) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'strict',
            secrue: true,
        })
        return res.sendStatus(204)
    }

    await User.findOneAndUpdate({ email: user.email }, { $set: { refreshToken: '' } })

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict',
        secrue: true,
    })
    return res.sendStatus(204)
}

export const getNewAccessToken = async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    const user = await User.findOne({ refreshToken: refreshToken })
    if (!user) return res.sendStatus(403)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user.email !== decoded.userEmail) return res.sendStatus(403)
            const accessToken = jwt.sign(
                { 'userEmail': user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            )
            return res.status(200).json({ accessToken })
        }
    )
}