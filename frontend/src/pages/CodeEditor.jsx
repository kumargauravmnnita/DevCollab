import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { runCode } from "../utils/codeRunner";
import AIPanel from "../components/AIPanel";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
];

const DEFAULT_CODE = {
  javascript: `// Welcome to DevCollab Editor
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,

  python: `# Welcome to DevCollab Editor
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,

  java: `// Welcome to DevCollab Editor
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  cpp: `// Welcome to DevCollab Editor
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

  c: `// Welcome to DevCollab Editor
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
};

const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [outputError, setOutputError] = useState(false);
  const [running, setRunning] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [activeOutput, setActiveOutput] = useState("output");

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput("");
  };

  const handleRunCode = async () => {
    setRunning(true);
    setOutput("");
    setOutputError(false);
    setActiveOutput("output");

    const result = await runCode(code, language);

    if (result.error) {
      setOutput(result.error);
      setOutputError(true);
    } else {
      setOutput(result.output || "Program ran with no output.");
    }
    setRunning(false);
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(id ? `/project/${id}` : "/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-sm sm:text-base font-bold text-white">
            Code Editor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-500 transition"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAI(!showAI)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              showAI
                ? "bg-primary-600 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            🤖 <span className="hidden sm:inline">AI</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={running}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
          >
            {running ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`flex flex-col ${showAI ? "w-full lg:w-2/3" : "w-full"} transition-all`}
        >
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={(val) => setCode(val || "")}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>

          <div className="h-44 bg-slate-950 border-t border-slate-700 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveOutput("output")}
                  className={`text-xs font-medium pb-1 transition ${
                    activeOutput === "output"
                      ? "text-white border-b border-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Output
                </button>
              </div>
              {output && (
                <button
                  onClick={() => {
                    setOutput("");
                    setOutputError(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {output ? (
                <pre
                  className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${outputError ? "text-red-400" : "text-green-400"}`}
                >
                  {output}
                </pre>
              ) : (
                <p className="text-slate-600 text-xs">
                  {running ? "Running..." : "Click Run to execute your code"}
                </p>
              )}
            </div>
          </div>
        </div>

        {showAI && (
          <div className="hidden lg:flex w-1/3 flex-col border-l border-slate-700">
            <AIPanel
              code={code}
              language={language}
              onClose={() => setShowAI(false)}
            />
          </div>
        )}
      </div>

      {showAI && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-slate-800">
          <AIPanel
            code={code}
            language={language}
            onClose={() => setShowAI(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
