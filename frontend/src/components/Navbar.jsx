import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({
  title = "DevCollab",
  showBack = false,
  backTo = "/dashboard",
  children,
}) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 dark:bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="max-w-full mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(backTo)}
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
          )}
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-base sm:text-lg font-bold text-primary-400 cursor-pointer"
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {children}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            title="Toggle theme"
          >
            {isDark ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-300 text-sm hidden md:block">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-slate-300 p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-slate-700 flex flex-col gap-3 px-1">
          <span className="text-slate-300 text-sm">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
