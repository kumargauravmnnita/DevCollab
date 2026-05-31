import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const SKILL_SUGGESTIONS = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "SQL",
  "Docker",
  "Git",
];

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        setName(data.name || "");
        setBio(data.bio || "");
        setSkills(data.skills || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const { data } = await axios.get("/api/user/stats");
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchProfile();
    fetchStats();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    try {
      await axios.put("/api/user/profile", { name, bio, skills });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error("Fill all fields");
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    setChangingPassword(true);
    try {
      await axios.put("/api/user/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return toast.error("Skill already added");
    if (skills.length >= 10) return toast.error("Max 10 skills");
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar title="DevCollab" showBack backTo="/dashboard" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {user?.name}
              </h2>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statsLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 rounded-lg p-3 animate-pulse"
                >
                  <div className="h-3 bg-slate-700 rounded mb-2 w-2/3"></div>
                  <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Projects</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.totalProjects || 0}
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.totalTasks || 0}
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats?.completedTasks || 0}
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Collaborators</p>
                  <p className="text-2xl font-bold text-primary-400">
                    {stats?.totalCollaborators || 0}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-white mb-6">
            Edit Profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition resize-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Skills
              </label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 bg-primary-600/20 text-primary-400 border border-primary-600/30 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-400 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Add a skill and press Enter"
                  className="flex-1 bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2.5 rounded-lg text-sm transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s))
                  .slice(0, 6)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2.5 py-1 rounded-full transition"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-white mb-6">
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        <div className="bg-slate-800 border border-red-900/30 rounded-xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button
            onClick={() => toast.error("Account deletion coming soon")}
            className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
