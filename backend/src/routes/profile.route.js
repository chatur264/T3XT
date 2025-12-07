import express from 'express'
import { updateProfile } from '../controllers/profile.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';
const router = express.Router()

router.use(arcjetProtection)

router.use(protectRoute) //Check Authentication frist
router.put("/update-profile", updateProfile);
router.get("/check-profile", (req, res) => {
    res.status(200).json(req.user);
});



export default router