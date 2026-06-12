require("dotenv").config();

const dashboardRoutes =
    require("./routes/dashboardRoutes");
const assignmentRoutes =
    require("./routes/assignmentRoutes");
const attendanceRoutes =
    require("./routes/attendanceRoutes");
const aiHistoryRoutes =
    require("./routes/aiHistoryRoutes");
const assignmentPriorityRoutes =
    require("./routes/assignmentPriorityRoutes");
const assignmentAnalyticsRoutes =
    require("./routes/assignmentAnalyticsRoutes");

const Groq = require("groq-sdk");
const express = require("express");
const supabase = require("./config/supabase");

const app = express();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
const cors = require("cors");

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api", attendanceRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", aiHistoryRoutes);
app.use("/api", assignmentRoutes);
app.use("/api", assignmentPriorityRoutes);
app.use("/api", assignmentAnalyticsRoutes);


// GET all assignments
app.get("/api/assignments", async (req, res) => {
    const { data, error } = await supabase
        .from("assignments")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
});

// CREATE assignment
app.post("/api/assignments", async (req, res) => {

    const { title, subject, status, deadline } = req.body;

    const { data, error } = await supabase
        .from("assignments")
        .insert([
            {
                title,
                subject,
                status,
                deadline
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
});

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        const chatCompletion =
            await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            });

        res.json({
            reply:
                chatCompletion.choices[0]
                    .message.content,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI request failed",
        });

    }

});


// const PORT = process.env.PORT || 5000;

app.post("/api/attendance-risk", async (req, res) => {

    try {

        const {
            subject,
            present_classes,
            total_classes
        } = req.body;

        const percentage =
            (present_classes / total_classes) * 100;

        let riskMessage = "";

        if (percentage >= 85) {
            riskMessage =
                "Safe attendance. You can miss a few classes.";
        }
        else if (percentage >= 75) {
            riskMessage =
                "Warning zone. Be careful with absences.";
        }
        else {
            riskMessage =
                "Danger zone. Attendance below required level.";
        }

        res.json({
            subject,
            percentage: percentage.toFixed(2),
            risk: riskMessage
        });

    } catch (error) {

        res.status(500).json({
            error: "Attendance prediction failed"
        });

    }

});

app.post("/api/study-plan", async (req, res) => {

    try {

        const { goal, days, hoursPerDay } = req.body;

        const chatCompletion =
            await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert study planner for college students. Create practical day-by-day study plans.",
                    },
                    {
                        role: "user",
                        content: `
                        Goal: ${goal}
                        Days Available: ${days}
                        Hours Per Day: ${hoursPerDay}

                        Create a detailed study plan.
                        `,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            });

        const studyPlanText =
            chatCompletion.choices[0]
                .message.content;

        await supabase
            .from("ai_history")
            .insert([
                {
                    feature: "study-plan",
                    input_text: goal,
                    output_text: studyPlanText
                }
            ]);

        res.json({
            studyPlan: studyPlanText
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Study plan generation failed",
        });

    }

});
app.post("/api/notes", async (req, res) => {

    try {

        const { topic } = req.body;

        const chatCompletion =
            await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert college professor. Create clean, exam-oriented notes for students. Use headings, bullet points, and simple language."
                    },
                    {
                        role: "user",
                        content:
                            `Create detailed notes on: ${topic}`
                    }
                ],
                model: "llama-3.3-70b-versatile"
            });

        const notesText =
            chatCompletion.choices[0]
                .message.content;

        await supabase
            .from("ai_history")
            .insert([
                {
                    feature: "notes",
                    input_text: topic,
                    output_text: notesText
                }
            ]);

        res.json({
            notes: notesText
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Notes generation failed"
        });

    }

});

app.post("/api/roadmap", async (req, res) => {

    try {

        const { goal } = req.body;

        const chatCompletion =
            await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert career mentor. Create detailed learning roadmaps for students.",
                    },
                    {
                        role: "user",
                        content: `Create a roadmap for: ${goal}`,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            });

        const roadmapText =
            chatCompletion.choices[0]
                .message.content;

        await supabase
            .from("ai_history")
            .insert([
                {
                    feature: "roadmap",
                    input_text: goal,
                    output_text: roadmapText
                }
            ]);

        res.json({
            roadmap: roadmapText
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Roadmap generation failed",
        });

    }

});

// // const express = require("express");

// const app = express();

// app.use(express.json());

// app.post("/ask-ai", (req, res) => {
//     const { question } = req.body;

//     res.json({
//         success: true,
//         question,
//         answer: "Backend received your question successfully!"
//     });
// });

// app.listen(5000, () => {
//     co
// nsole.log("Server running on port 5000");
// });

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "CampusFlow AI Backend Running"
  });
});
const PORT = process.env.PORT || 5000;
app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;

    if (
        email === "demo@student.com" &&
        password === "demo123"
    ) {
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                name: "Demo Student",
                email
            }
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid email or password"
    });

});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});