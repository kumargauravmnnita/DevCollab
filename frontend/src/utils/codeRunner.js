const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "";

export const runCode = async (code, language) => {
  if (!RAPIDAPI_KEY) {
    return simulateRun(code, language);
  }

  try {
    const languageId = LANGUAGE_IDS[language] || 63;

    const submitRes = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: "",
        }),
      },
    );

    const result = await submitRes.json();

    if (result.stdout) return { output: result.stdout, error: null };
    if (result.stderr) return { output: null, error: result.stderr };
    if (result.compile_output)
      return { output: null, error: result.compile_output };
    return { output: "Program executed with no output.", error: null };
  } catch (err) {
    return { output: null, error: "Failed to run code: " + err.message };
  }
};

const simulateRun = (code, language) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        output: `[Simulated] ${language} code executed.\nTo enable real execution, add VITE_RAPIDAPI_KEY to frontend/.env`,
        error: null,
      });
    }, 800);
  });
};
