import { useState, useEffect } from "react";
import axios from "axios";

const ROLE_COLORS = {
  owner: "bg-purple-500/20 text-purple-400",
  collaborator: "bg-blue-500/20 text-blue-400",
  viewer: "bg-slate-500/20 text-slate-400",
};

const MembersPanel = ({ projectId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("collaborator");
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/projects/${projectId}/members`);
      setMembers(data);
    } catch (err) {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Please enter an email");
    setInviting(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`/api/projects/${projectId}/members/invite`, {
        email,
        role,
      });
      setSuccess(`${email} invited successfully!`);
      setEmail("");
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to invite member");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await axios.delete(`/api/projects/${projectId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.user._id !== memberId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl w-full max-w-md border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-base font-semibold text-white">Team Members</h2>
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleInvite} className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Invite by email
            </label>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-3 py-2 rounded-lg text-xs">
                {success}
              </div>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition placeholder-slate-500"
            />
            <div className="flex gap-2">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
              >
                <option value="collaborator">Collaborator</option>
                <option value="viewer">Viewer</option>
              </select>
              <button
                type="submit"
                disabled={inviting}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
              >
                {inviting ? "Inviting..." : "Invite"}
              </button>
            </div>
          </form>

          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Members ({members.length})
            </p>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.user._id}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-slate-200 font-medium">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {member.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[member.role]}`}
                      >
                        {member.role}
                      </span>
                      {member.role !== "owner" && (
                        <button
                          onClick={() => handleRemove(member.user._id)}
                          className="text-slate-600 hover:text-red-400 transition"
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPanel;
