const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "HackGURU backend is running!"
    });
});

// Students
const studentRoutes = require("./routes/students");
app.use("/api/students", studentRoutes);

// Profile
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

// Events
const eventRoutes = require("./routes/events");
app.use("/api/events", eventRoutes);

// Event Matching
const eventMatchingRoutes = require("./routes/event-matching");
app.use("/api/event-matching", eventMatchingRoutes);

// Recommendations
const recommendationRoutes = require("./routes/recommendations");
app.use("/api/recommendations", recommendationRoutes);

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});