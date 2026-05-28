const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) return res.status(400).json({ message: "Code is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert code reviewer. Review the following ${language || "code"} and provide:
1. A brief overall assessment (1-2 sentences)
2. List of issues/bugs found (if any)
3. Suggestions for improvement
4. A quality score out of 10

Keep your response concise and developer-friendly. Use plain text, no markdown.

Code to review:
\`\`\`${language || ""}
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const review = result.response.text();

    res.json({ review });
  } catch (error) {
    console.error("AI review error:", error);
    res.status(500).json({ message: "AI review failed: " + error.message });
  }
};

const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) return res.status(400).json({ message: "Code is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Explain the following ${language || "code"} in simple terms that a beginner can understand.
Be concise (max 5-6 sentences). Focus on what it does, not how every line works.
Use plain text, no markdown.

Code:
\`\`\`${language || ""}
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.json({ explanation });
  } catch (error) {
    console.error("AI explain error:", error);
    res
      .status(500)
      .json({ message: "AI explanation failed: " + error.message });
  }
};

const generateTasks = async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription)
      return res
        .status(400)
        .json({ message: "Project description is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a project manager. Based on this project description, generate exactly 8-10 development tasks.

Project: ${projectDescription}

Respond with ONLY a valid JSON array, no extra text, no markdown, no backticks.
Each task must have: title (string), description (string), priority ("low" | "medium" | "high"), status ("todo")

Example format:
[{"title":"Setup project","description":"Initialize the repository","priority":"high","status":"todo"}]`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const tasks = JSON.parse(text);
    res.json({ tasks });
  } catch (error) {
    console.error("AI tasks error:", error);
    res
      .status(500)
      .json({ message: "Task generation failed: " + error.message });
  }
};

module.exports = { reviewCode, explainCode, generateTasks };
