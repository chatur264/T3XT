import express from 'express'
import { login, logout, signup } from '../controllers/auth.controller.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';

const router = express.Router()

router.use(arcjetProtection);

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router