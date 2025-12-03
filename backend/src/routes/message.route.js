import express from 'express'
import { getAllContacts, getChatPartners, getLastConversations, getMessagesByOtherUser, sendMessage } from '../controllers/message.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { arcjetProtection } from '../middlewares/arcjet.middleware.js'
const router = express.Router()

// router.use(arcjetProtection)

router.use(protectRoute) //Check Authentication frist
router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners)
router.get("/lastConversation", getLastConversations)
router.get("/:id", getMessagesByOtherUser)
router.post("/send/:id", sendMessage)




export default router