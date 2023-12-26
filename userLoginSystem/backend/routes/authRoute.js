import { Router } from "express";
import { getNewAccessToken, logOut, login, signUp } from "../controllers/authController.js";

const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/logout', logOut)
router.get('/refresh', getNewAccessToken)

export default router