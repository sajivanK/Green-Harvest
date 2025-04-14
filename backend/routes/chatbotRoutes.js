import express from "express";
import { chatWithBot, getChatHistory, resetChatHistory } from "../controllers/chatbotController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const chatbotRouter = express.Router();

// ✅ Authenticated Routes
chatbotRouter.post("/ask", authenticate, chatWithBot);
chatbotRouter.get("/history", authenticate, getChatHistory);
chatbotRouter.delete("/history", authenticate, resetChatHistory);


export default chatbotRouter;
