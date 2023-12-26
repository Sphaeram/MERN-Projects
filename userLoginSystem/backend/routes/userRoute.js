import { Router } from "express";
import { getAllUsers } from '../controllers/userController.js'
import { verifyJWT } from "../utility/verifyJWT.js";

const router = Router()

router.get('/users', verifyJWT ,getAllUsers)

export default router