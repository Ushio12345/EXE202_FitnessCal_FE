import React from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = React.useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  React.useEffect(() => {
    // Sync with system theme if user hasn't set
    const saved = localStorage.getItem('theme');
    if (!saved) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mq.matches);
      mq.onchange = (e) => setIsDark(e.matches);
      return () => { mq.onchange = null; };
    }
  }, []);

  return (
    <button
      className="fixed top-6 right-6 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-200"
      aria-label="Chuyển đổi chế độ sáng/tối"
      onClick={() => setIsDark(v => !v)}
    >
      {isDark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-500" />}
    </button>
  );
};

export default ThemeToggle;
