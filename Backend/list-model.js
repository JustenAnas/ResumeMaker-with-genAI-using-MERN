require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

console.log("Checking API Key:", process.env.GOOGLE_GENAI_API_KEY ? "FOUND ✅" : "NOT FOUND ❌");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function list() {
    try {
        const response = await ai.models.list();
        console.log("--- Available Models ---");
        
        // Since it's an object/map, we'll log the whole thing to see the keys
        console.log(JSON.stringify(response, null, 2));

    } catch (err) {
        console.error("❌ Error fetching models:", err.message);
    }
}

list();