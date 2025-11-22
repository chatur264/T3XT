import express from 'express'
import { updateProfile } from '../controllers/profile.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';
const router = express.Router()

router.use(arcjetProtection)

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check-profile", protectRoute, (req, res) => {
    res.status(200).json(req.user);
});



export default router