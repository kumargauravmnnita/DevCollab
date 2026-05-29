import { useState } from "react";
import axios from "axios";

const AITaskGenerator = ({ onClose, onTasksGenerated }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState([]);
  const [step, setStep] = useState("input");

  const handleGenerate = async () => {
    if (!description.trim()) return setError("Please describe your project");
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/ai/generate-tasks", {
        projectDescription: description,
      });
      setPreview(data.tasks);
      setStep("preview");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = async () => {
    setLoading(true);
    try {
      await onTasksGenerated(preview);
      onClose();
    } catch (err) {
      setError("Failed to add tasks");
    } finally {
      setLoading(false);
    }
  };

  const removeTask = (index) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const PRIORITY_COLORS = {
    low: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl w-full max-w-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h2 className="text-base font-semibold text-white">
                AI Task Generator
              </h2>
              <p className="text-xs text-slate-400">
                {step === "input"
                  ? "Describe your project and AI will create tasks"
                  : `${preview.length} tasks generated — review and add`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "input" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Describe your project
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. An e-commerce website with product listings, shopping cart, user authentication, payment integration and order tracking..."
                  rows={5}
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition placeholder-slate-500 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400 font-medium mb-2">
                  💡 Tips for better results
                </p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>• Mention the tech stack (React, Node.js, MongoDB...)</li>
                  <li>• Include key features you want to build</li>
                  <li>• Mention integrations (payments, auth, APIs...)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-3">
                  {error}
                </div>
              )}
              {preview.map((task, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-slate-900/60 border border-slate-700 rounded-lg p-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-slate-200 text-sm font-medium">
                        {task.title}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeTask(index)}
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 mt-0.5"
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
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex gap-3 flex-shrink-0">
          {step === "input" ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  "✨ Generate Tasks"
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setStep("input");
                  setPreview([]);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 rounded-lg text-sm font-medium transition"
              >
                ← Regenerate
              </button>
              <button
                onClick={handleAddAll}
                disabled={loading || preview.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Adding...
                  </>
                ) : (
                  `Add ${preview.length} Tasks to Board`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITaskGenerator;
