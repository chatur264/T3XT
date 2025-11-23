import express from 'express'
import { getAllContacts, getChatPartners, getMessagesByOtherUser, sendMessage } from '../controllers/message.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { arcjetProtection } from '../middlewares/arcjet.middleware.js'
const router = express.Router()

// router.use(arcjetProtection)

router.use(protectRoute)
router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners)
router.get("/:id", getMessagesByOtherUser)
router.post("/send/:id", sendMessage)



export default router