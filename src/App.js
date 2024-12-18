import React, { useEffect } from "react";
import "./App.css";
import { ArticleProvider } from "./context/ArticleContext";
import { ModalProvider } from "./context/ModalContext";
import ArticleViewContainer from "./components/ArticleViewContainer";
import Modal from "./components/Modal";
import Header from "./components/Header";

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
        <div className="App flex flex-col">
          <div className="tablet:hidden">
            <Header />
          </div>
          <main className="w-screen min-h-[calc(100vh-40px)] tablet:min-h-screen relative">
            <ArticleViewContainer />
          </main>
          <Modal />
        </div>
      </ArticleProvider>
    </ModalProvider>
  );
}
