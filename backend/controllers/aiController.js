const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const chat = async (req, res) => {

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

        res.status(500).json({
            error: "AI request failed",
        });

    }

};

const roadmap = async (req, res) => {

    try {

        const { goal } = req.body;

        const chatCompletion =
            await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert career mentor.",
                    },
                    {
                        role: "user",
                        content:
                            `Create a roadmap for: ${goal}`,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            });

        res.json({
            roadmap:
                chatCompletion.choices[0]
                    .message.content,
        });

    } catch (error) {

        res.status(500).json({
            error: "Roadmap generation failed",
        });

    }

};

module.exports = {
    chat,
    roadmap
};