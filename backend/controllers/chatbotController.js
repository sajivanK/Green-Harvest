
import dotenv from "dotenv";
import axios from "axios";
import ChatModel from "../models/chatModel.js";

dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?.id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const casual = message.trim().toLowerCase();
        if (["hi", "hello", "hey"].includes(casual)) {
            const reply = "Hi there! 👋 How can I assist you with farming today?";
            await ChatModel.create({ userId, message, reply });
            return res.json({ success: true, reply });
        }

        console.log(`User ${userId} asked: ${message}`);

const isTamil = /[\u0B80-\u0BFF]/.test(message);

const farmingPrompt = `
You are an advanced **AI Farming Assistant** with expertise in **crop cultivation, vegetable farming, fruit orchards, and dairy farming**.
Your goal is to provide **accurate, research-backed agricultural advice** that helps farmers **increase productivity and sustainability**.

- Use **scientific and practical** farming techniques.
- Focus on **organic, sustainable**, and **profitable** farming methods.
- Provide **region-specific** recommendations if necessary.
- Suggest **disease prevention** strategies using natural methods.
- Keep your answers short, practical, and in clear bullet points.
${isTamil ? "- ⚡️ Important: Reply in **Tamil language** only." : ""}
Answer the following farming question:

Q: ${message}
A:
`.trim();


        const sendGeminiRequest = async () => {
            const maxRetries = 3;
            let attempt = 0;
            let delay = 5000;

            while (attempt < maxRetries) {
                try {
                    const response = await axios.post(
                        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                        {
                            contents: [
                                {
                                    role: "user",
                                    parts: [{ text: farmingPrompt }]
                                }
                            ]
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            timeout: 60000,
                        }
                    );
                    return response;
                } catch (error) {
                    if (error.response?.status === 503 || error.code === "ECONNABORTED") {
                        attempt++;
                        console.warn(`Gemini API busy. Retrying (${attempt}/${maxRetries}) after ${delay / 1000} seconds...`);
                        if (attempt < maxRetries) {
                            await new Promise((resolve) => setTimeout(resolve, delay));
                            delay *= 2;
                        } else {
                            throw new Error("Service temporarily unavailable after multiple retries.");
                        }
                    } else {
                        throw error;
                    }
                }
            }
        };

        const response = await sendGeminiRequest();

        let reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        reply = reply.replace(/\s+/g, ' ').trim();

        if (!isTamil &&!/farm|crop|fertilizer|soil|organic|vegetable|livestock|milk|pest/i.test(reply)) {
            reply = "Sorry, I couldn't generate a proper farming-related answer. Please try rephrasing your question!";
        }

        await ChatModel.create({ userId, message, reply });
        return res.json({ success: true, reply });

    } catch (error) {
        console.error("Chatbot Error:", error.response?.data || error.message);
        if (error.message.includes("Service temporarily unavailable after multiple retries.")) {
            return res.status(503).json({ success: false, message: "Gemini server is temporarily busy. Please try again later." });
        }
        res.status(500).json({ success: false, message: "Failed to process request" });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized user." });
        }

        const chats = await ChatModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
        res.json({ success: true, chats });
    } catch (error) {
        console.error("Chatbot History Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch chat history" });
    }
};

export const resetChatHistory = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized user." });
        }

        await ChatModel.deleteMany({ userId });
        res.json({ success: true, message: "Chat history cleared." });
    } catch (error) {
        console.error("Chatbot Reset Error:", error);
        res.status(500).json({ success: false, message: "Failed to reset chat history." });
    }
};