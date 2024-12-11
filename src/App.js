import React, { useEffect } from "react";
import "./App.css";
import { ArticleProvider } from "./context/ArticleContext";
import { ModalProvider } from "./context/ModalContext";
import ArticleViewContainer from "./components/ArticleViewContainer";
import Modal from "./components/Modal";

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <ModalProvider>
      <ArticleProvider>
        <div className="App flex">
          <main className="w-screen min-h-screen pt-px relative">
            <ArticleViewContainer />
          </main>
          <Modal />
        </div>
      </ArticleProvider>
    </ModalProvider>
  );
}
