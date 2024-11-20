import React, { useEffect } from "react";
import "./App.css";
import { ArticleProvider } from "./context/ArticleContext";
import ArticleViewContainer from "./components/ArticleViewContainer";

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
    <ArticleProvider>
      <div className="App flex">
        <main className="w-screen mx-auto min-h-screen pt-px relative">
          <ArticleViewContainer />
        </main>
      </div>
    </ArticleProvider>
  );
}
