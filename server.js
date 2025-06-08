import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import * as fs from "fs/promises";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let conversationHistory = { messages: [] }; // Store history in memory

// Load conversation history from file on startup
const loadConversationHistory = async () => {
    try {
        const data = await fs.readFile("conversation.json", "utf8");
        conversationHistory = JSON.parse(data);
    } catch (error) {
        console.error("Error reading conversation file, starting fresh:", error);
        conversationHistory = { messages: [] }; // Start fresh if file doesn't exist
    }
};
loadConversationHistory();

app.post("/chat", async (req, res) => {
    const { userMessage } = req.body;
    conversationHistory.messages.push({role: "user", content: userMessage});

    try {
        const response = await groq.chat.completions.create({
            messages: conversationHistory.messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_completion_tokens: 400,
            top_p: 0.7,
        });
        
        const botReply = response.choices[0].message.content;
        conversationHistory.messages.push({role: "assistant", content: botReply});
        fs.writeFile("conversation.json", JSON.stringify(conversationHistory, null, 2))
            .catch(err => console.error("Error saving conversation:", err));
        res.json({ reply: botReply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
