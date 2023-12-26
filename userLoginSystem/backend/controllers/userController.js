import User from "../models/User.js"

export const getAllUsers = async (reqe, res, next) => {
    try {
        const users = await User.find().lean()
        if (users && users !== undefined) {
            return res.status(200).json({ users })
        } else {
            return res.status(500).json({ msg: 'Internal Sever Error' })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Internal Sever Error' })
    }
}