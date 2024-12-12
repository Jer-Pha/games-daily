import React, { useContext, useEffect } from "react";
import { ArticleContext } from "../context/ArticleContext";
import { ModalContext } from "../context/ModalContext";
import { InfoIcon, LogoIcon, ModeToggleIcon } from "../utils/Icons";

export default function ViewButtonGroup({ selectedView, setSelectedView }) {
  const { setSelectedArticle } = useContext(ArticleContext);
  const { openModal, closeModal, isModalOpen } = useContext(ModalContext);

  const buttonStyles = {
    topics: {
      topics:
        "font-semibold border-b-transparent border-[1px] border-[var(--text-color)]",
      outlets: "inner-top-right border-b-[1px] border-[var(--text-color)]",
      filter: "inner-top-right border-b-[1px] border-[var(--text-color)]",
    },
    outlets: {
      topics: "inner-top-left border-b-[1px] border-[var(--text-color)]",
      outlets:
        "font-semibold border-b-transparent border-[1px] border-[var(--text-color)]",
      filter: "inner-top-right border-b-[1px] border-[var(--text-color)]",
    },
    filter: {
      topics: "inner-top-left border-b-[1px] border-[var(--text-color)]",
      outlets: "inner-top-left border-b-[1px] border-[var(--text-color)]",
      filter:
        "font-semibold border-b-transparent border-[1px] border-[var(--text-color)]",
    },
  };

  const toggleMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const handleViewClick = (tab) => {
    if (selectedView !== tab) {
      setSelectedArticle(null);
      setSelectedView(tab);
    }
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen, closeModal]);

  const handleInfoBtnClick = () => {
    openModal(
      <>
        <h2 className="font-semibold text-xl">About Us</h2>
        <p className="text-sm text-justify">
          Staying up-to-date with the gaming world can be a challenge. With
          countless news outlets and articles flooding the internet, it's easy
          to miss the stories that matter most to you. That's where we come in.
        </p>
        <p className="text-sm text-justify">
          We provide a daily snapshot of the most popular, trending, and recent
          gaming news, gathering articles from{" "}
          <span className="font-heavitas">29</span> leading gaming news outlets
          and delivering them in an easy-to-browse format.
        </p>
        <p className="text-sm text-justify">
          With <span className="font-heavitas">Controller Chronicle</span>,
          finding news that fits your interests is a breeze. We identify and
          sort the topics of hundreds of articles, making it simple to discover
          the news you care about. Don't forget to try out the topic search in
          our Filter tab!
        </p>
        <p className="text-sm text-justify">
          We automatically check for new articles throughout the day, so you can
          be sure you're always seeing the most trending news, no matter when
          you visit. Start exploring the latest gaming news now!
        </p>
      </>
    );
  };

  return (
    <div className="flex bg-transparent desktop:w-[content-d] max-w-screen-desktop border-r-[1px] border-transparent tab-corners">
      <button
        className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] rounded-t-lg ${
          buttonStyles[selectedView]?.topics || ""
        }`}
        onClick={() => handleViewClick("topics")}
        disabled={selectedView === "topics"}
        type="button"
        aria-label="Articles by topic"
      >
        Topics
      </button>
      <button
        className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--surface-color)] rounded-t-lg ${
          buttonStyles[selectedView]?.outlets || ""
        }`}
        onClick={() => handleViewClick("outlets")}
        disabled={selectedView === "outlets"}
        type="button"
        aria-label="Articles by outlet"
      >
        Outlets
      </button>
      <button
        className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] rounded-t-lg ${
          buttonStyles[selectedView]?.filter || ""
        }`}
        onClick={() => handleViewClick("filter")}
        disabled={selectedView === "filter"}
        type="button"
        aria-label="Filter articles"
      >
        Filter
      </button>
      <div className="hidden tablet:block flex-1 border-b-[1px] border-[var(--text-color)] bg-[var(--bg-color)]">
        <div className="hidden tablet:flex justify-center items-center h-full cursor-default">
          <div className="hidden desktop:block p-0.5 h-10 w-10" type="button">
            <LogoIcon />
          </div>
          <h1 className="font-heavitas text-lg desktop:text-2xl px-2">
            Controller Chronicle
          </h1>
        </div>
      </div>
      <div className="flex-1 tablet:flex-initial border-b-[1px] border-[var(--text-color)] bg-[var(--bg-color)] flex justify-center align-middle">
        <button
          className=""
          onClick={handleInfoBtnClick}
          type="button"
          aria-label="Site information"
        >
          <div
            className="p-0.5 m-1 h-10 w-10 tablet:h-8 tablet:w-8"
            type="button"
          >
            <InfoIcon />
          </div>
        </button>
      </div>
      <button
        className="border-[1px] border-[var(--text-color)] bg-[var(--accent-color)] rounded-t-lg -mr-px"
        onClick={toggleMode}
        type="button"
        aria-label="Toggle dark mode"
      >
        <div
          className="p-2 tablet:p-1.5 m-2 tablet:m-1 h-10 w-10 tablet:h-8 tablet:w-8"
          type="button"
        >
          <ModeToggleIcon />
        </div>
      </button>
    </div>
  );
}
