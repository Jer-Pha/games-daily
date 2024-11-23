import React, { useContext } from "react";
import { ArticleContext } from "../context/ArticleContext";
import { ModeToggleIcon } from "../utils/Icons";

export default function ViewButtonGroup({ selectedView, setSelectedView }) {
  const { setSelectedArticle } = useContext(ArticleContext);
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

  return (
    <div className="flex bg-transparent tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-r-[1px] border-transparent tab-corners">
      <button
        className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] rounded-t-lg ${
          buttonStyles[selectedView]?.topics || ""
        }`}
        onClick={() => handleViewClick("topics")}
        disabled={selectedView === "topics"}
      >
        Topics
      </button>
      <button
        className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--surface-color)] rounded-t-lg ${
          buttonStyles[selectedView]?.outlets || ""
        }`}
        onClick={() => handleViewClick("outlets")}
        disabled={selectedView === "outlets"}
      >
        Outlets
      </button>
      <button
        className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] rounded-t-lg ${
          buttonStyles[selectedView]?.filter || ""
        }`}
        onClick={() => handleViewClick("filter")}
        disabled={selectedView === "filter"}
      >
        Filter
      </button>
      <div className="flex-1 border-b-[1px] border-[var(--text-color)]"></div>
      <button
        className="border-[1px] border-[var(--text-color)] bg-[var(--accent-color)] rounded-t-lg -mr-px"
        onClick={toggleMode}
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
