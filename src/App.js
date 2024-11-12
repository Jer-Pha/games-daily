import React, { useEffect } from "react";
import "./App.css";
import ArticleHub from "./components/ArticleHub";

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
          className="fixed top-0 left-0 px-2 py-1 m-4 bg-[var(--bg-color)] rounded-md"
          onClick={toggleMode}
        >
          Toggle
        </button>
      </main>
    </div>
  );
}
