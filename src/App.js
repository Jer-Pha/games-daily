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

  return (
    <div className="App">
      <main className="max-w-[1400px] mx-auto bg-[var(--bg-color)]">
        <ArticleHub searchQuery={""} />
      </main>
    </div>
  );
}
