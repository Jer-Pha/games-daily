import React, { useEffect } from "react";
import "./App.css";
import ArticleViewContainer from "./components/ArticleViewContainer";
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
    <div className="App flex">
      <main className="w-screen desktop:max-w-[1400px] mx-auto min-h-screen">
        <ArticleViewContainer />
      </main>
      <button
        className="fixed bottom-0 left-0 p-2 tablet:p-2 mx-5 my-10 tablet:m-4 bg-[var(--accent-color)] desktop:bg-[var(--bg-color)] rounded-full aspect-square z-[999] h-12 w-12 tablet:h-10 tablet:w-10"
        onClick={toggleMode}
        type="button"
      >
        <ModeToggleIcon />
      </button>
    </div>
  );
}
