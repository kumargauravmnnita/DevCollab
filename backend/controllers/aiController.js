const Groq = require("groq-sdk");

let groqClient = null;

const getGroq = () => {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
};

const callGroq = async (prompt) => {
  const completion = await getGroq().chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2048,
  });
  return completion.choices[0].message.content;
};

const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });

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

    const review = await callGroq(prompt);
    res.json({ review });
  } catch (error) {
    console.error("AI review error:", error.message);
    res.status(500).json({ message: "AI review failed: " + error.message });
  }
};

const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ message: "Code is required" });

    const prompt = `Explain the following ${language || "code"} in simple terms that a beginner can understand.
Be concise (max 5-6 sentences). Focus on what it does, not how every line works.
Use plain text, no markdown.

Code:
\`\`\`${language || ""}
${code}
\`\`\``;

    const explanation = await callGroq(prompt);
    res.json({ explanation });
  } catch (error) {
    console.error("AI explain error:", error.message);
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

    const prompt = `You are a project manager. Based on this project description, generate exactly 8-10 development tasks.

Project: ${projectDescription}

Respond with ONLY a valid JSON array, no extra text, no markdown, no backticks.
Each task must have: title (string), description (string), priority ("low" | "medium" | "high"), status ("todo")

Example format:
[{"title":"Setup project","description":"Initialize the repository","priority":"high","status":"todo"}]`;

    let text = await callGroq(prompt);
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const tasks = JSON.parse(text);
    res.json({ tasks });
  } catch (error) {
    console.error("AI tasks error:", error.message);
    res
      .status(500)
      .json({ message: "Task generation failed: " + error.message });
  }
};

module.exports = { reviewCode, explainCode, generateTasks };
