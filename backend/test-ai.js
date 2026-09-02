const { getAIRecommendations } = require("./ai-service");

async function testAI() {
    console.log("Connecting to Person 3 AI service...");

    const result = await getAIRecommendations("S001");

    if (!result) {
        console.log("❌ AI service connection failed.");
        return;
    }

    console.log("✅ AI service connected successfully!");
    console.log(JSON.stringify(result, null, 2));
}

testAI();