import { useState } from "react";
import api from "../utils/api";

const AIPanel = ({ code, language, onClose }) => {
  const [activeTab, setActiveTab] = useState("review");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return setResult("Please write some code first.");
    setLoading(true);
    setResult("");
    try {
      const { data } = await api.post("/api/ai/review", { code, language });
      setResult(data.review);
    } catch (err) {
      setResult("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) return setResult("Please write some code first.");
    setLoading(true);
    setResult("");
    try {
      const { data } = await api.post("/api/ai/explain", { code, language });
      setResult(data.explanation);
    } catch (err) {
      setResult("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 border-l border-slate-700">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-semibold text-white">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-slate-700">
        {["review", "explain"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition ${
              activeTab === tab
                ? "text-primary-400 border-b-2 border-primary-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab === "review" ? "Code Review" : "Explain Code"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {result ? (
          <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap bg-slate-900 rounded-lg p-3 border border-slate-700">
            {result}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            {activeTab === "review"
              ? "Click 'Review Code' to get AI feedback on your code quality, bugs, and improvements."
              : "Click 'Explain Code' to get a simple explanation of what your code does."}
          </div>
        )}
        {loading && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400">AI is thinking...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={activeTab === "review" ? handleReview : handleExplain}
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
        >
          {loading
            ? "Processing..."
            : activeTab === "review"
              ? "Review Code"
              : "Explain Code"}
        </button>
      </div>
    </div>
  );
};

export default AIPanel;
