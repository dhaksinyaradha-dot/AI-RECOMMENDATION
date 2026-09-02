const axios = require("axios");

const AI_SERVICE_URL = "http://172.31.99.120:5001";

async function getAIRecommendations(studentId) {
    try {
        console.log("🤖 Calling AI service...");

        const url = `${AI_SERVICE_URL}/recommend`;

        console.log("🤖 AI URL:", url);
        console.log("🤖 Student ID:", studentId);

        const response = await axios.get(url, {
            params: {
                student_id: studentId
            },
            timeout: 30000
        });

        console.log("✅ AI service responded successfully");

        return response.data;

    } catch (error) {

        console.error(
            "❌ Error connecting to AI/ML service:",
            error.message
        );

        if (error.response) {
            console.error(
                "AI status:",
                error.response.status
            );
        }

        return null;
    }
}

module.exports = {
    getAIRecommendations
};