import dotenv from "dotenv";
import axios from "axios";
import ChatModel from "../models/chatModel.js";

dotenv.config();

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";
//const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
//const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?.id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // ✅ Handle greetings
        const casual = message.trim().toLowerCase();
        if (["hi", "hello", "hey"].includes(casual)) {
            const reply = "Hi there! 👋 How can I assist you with farming today?";
            await ChatModel.create({ userId, message, reply });
            return res.json({ success: true, reply });
        }

        console.log(`User ${userId} asked: ${message}`);

        const farmingContext = `
You are an advanced **AI Farming Assistant** with expertise in **crop cultivation, vegetable farming, fruit orchards, and dairy farming**. 
Your goal is to provide **accurate, research-backed agricultural advice** that helps farmers **increase productivity and sustainability**.

### 🌱 **General Guidelines for Answers:**
- Use **scientific and practical** farming techniques.
- Focus on **organic, sustainable**, and **profitable** farming methods.
- Provide **region-specific** recommendations if necessary.
- Suggest **disease prevention** strategies using natural methods.

---

### 🌾 **Examples of Farming Questions & Best Practices:**

#### **1️⃣ Crop Farming (Grains & Field Crops)**
- **Q:** What are the best crops for **dry climates**?  
**A:** The best drought-resistant crops include **sorghum, millet, chickpeas, cowpeas, and lentils**. These crops require **minimal irrigation** and can **tolerate extreme heat**.  
➜ Use **drip irrigation** to conserve water and increase yield.

- **Q:** What fertilizers should I use for **corn farming**?  
**A:** Corn thrives on **nitrogen-rich fertilizers**. Use a combination of:
- Organic: **Compost, manure, and bone meal**
- Inorganic: **Urea and ammonium nitrate**
➜ Apply fertilizers **before the tasseling stage** for maximum growth.

---

#### **2️⃣ Vegetable Farming 🥬**
- **Q:** How can I **prevent pests** in organic vegetable farming?  
**A:** Use **natural pest control** like:
- **Neem oil spray** for aphids and whiteflies.
- **Marigolds** as companion plants to repel insects.
- **Handpicking caterpillars** in leafy greens.
➜ Avoid **chemical pesticides** to maintain soil health.

- **Q:** What are the best **vegetables for greenhouses**?  
**A:** The most profitable greenhouse vegetables include:
- **Tomatoes** 🍅 (Require staking & temperature control)
- **Lettuce** 🥬 (Fast-growing & low maintenance)
- **Bell Peppers** 🌶️ (Thrives in controlled humidity)
➜ Use **hydroponics** for higher yields in greenhouse farming.

---

#### **3️⃣ Fruit Orchards 🍎**
- **Q:** What are the best **fruits for tropical climates**?  
**A:** The best tropical fruits include:
- **Mangoes** 🥭 (Heat-tolerant & high yield)
- **Pineapples** 🍍 (Thrives in acidic soil)
- **Papayas** 🍈 (Fast-growing & pest-resistant)
➜ Ensure **regular pruning** to improve fruit quality.

- **Q:** How do I **increase fruit yield in apple orchards**?  
**A:** Apply these **best practices**:
- **Prune trees annually** to improve airflow.
- Use **drip irrigation** to prevent overwatering.
- Apply **potassium & phosphorus fertilizers** during flowering.
➜ Protect apples from fungal diseases using **copper-based fungicides**.

---

#### **4️⃣ Dairy Farming 🐄**
- **Q:** How can I **increase milk production in dairy cows**?  
**A:** Follow these **key dairy farming practices**:
- Feed cows **high-protein diets** (alfalfa, soy meal, silage).
- Ensure **clean drinking water** (50–60 liters/day/cow).
- Maintain a **stress-free, clean barn** to prevent mastitis.
➜ **Regular veterinary check-ups** boost herd health.

- **Q:** What is the best **natural feed** for dairy cows?  
**A:** The most nutritious organic feed includes:
- **Legume-based fodder** (alfalfa, clover, and cowpea hay)
- **Silage from corn or sorghum** for winter feeding
- **Mineral supplements** (calcium & phosphorus) to support milk production.
➜ Avoid excessive grain feeding to prevent **acidosis**.

---

Q: ${message}
A:
        `.trim();

        const response = await axios.post(
            HUGGINGFACE_API_URL,
            {
                inputs: farmingContext,
                parameters: {
                    max_new_tokens: 250,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            }
        );

        let generated = response.data[0]?.generated_text || '';
        generated = generated.replace(/\s+/g, ' ').trim();
        let reply = generated.split("A:").pop().split("Q:").shift().trim();

        if (!/farm|crop|fertilizer|soil|organic|vegetable|livestock|milk|pest/i.test(reply)) {
            reply = "Sorry, I couldn't generate a proper farming-related answer. Please try rephrasing your question!";
        }

        await ChatModel.create({ userId, message, reply });
        return res.json({ success: true, reply });

    } catch (error) {
        console.error("Chatbot Error:", error.response?.data || error.message);
        if (error.response?.status === 503) {
            return res.status(503).json({ success: false, message: "Hugging Face API is temporarily unavailable. Try again later." });
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
