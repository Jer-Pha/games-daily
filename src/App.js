import React, { useEffect } from "react";
import "./App.css";
import ArticleHub from "./components/ArticleHub";
import { ModeToggleIcon } from "./components/Icons";

export default function App() {
  console.log("App rendered");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="App">
      <main className="max-w-[1400px] mx-auto bg-[var(--bg-color)]">
        <ArticleHub searchQuery={""} />
        <button
          className="fixed bottom-0 left-0 p-2 m-4 bg-[var(--accent-color)] desktop:bg-[var(--bg-color)] rounded-full aspect-square z-[999] h-10 w-10"
          onClick={toggleMode}
          type="button"
        >
          <ModeToggleIcon />
        </button>
      </main>
    </div>
  );
}
