import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRouter from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'

const app = express()
const PORT = process.env.PORT || 5000
config()

const connect = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(() => {
        console.log('Connected to MongoDB!')
    }).catch(error => console.log(error))
}

///////////////////////////
////   MIDDLE-WARES   /////
///////////////////////////

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,               //access-control-allow-credentials:true
    optionsSuccessStatus: 200
}))
app.use(cookieParser())
app.use(express.json())

// ROUTES
app.use('/api/auth', authRouter)
app.use('/api', userRoute)

// ERROR HANDLING
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "An Error Ocurred!"
    const errorStack = err.stack || "An Error Ocurred!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        // stack: errorStack
    })
})

app.listen(PORT, () => {
    connect()
    console.log(`Connected to backend! PORT: ${PORT}`)
})