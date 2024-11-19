import React from "react";

export default function ViewButtonGroup({
  selectedView,
  setSelectedView,
  setSelectedArticle,
}) {
  const buttonStyles = {
    topics: {
      topics:
        "font-semibold border-b-0 border-[1px] border-[var(--text-color)]",
      outlets: "inner-top-right border-b-[1px] border-[var(--text-color)]",
      filter: "inner-top-right border-b-[1px] border-[var(--text-color)]",
    },
    outlets: {
      topics: "inner-top-left border-b-[1px] border-[var(--text-color)]",
      outlets:
        "font-semibold border-b-0 border-[1px] border-[var(--text-color)]",
      filter: "inner-top-right border-b-[1px] border-[var(--text-color)]",
    },
    filter: {
      topics: "inner-top-left border-b-[1px] border-[var(--text-color)]",
      outlets: "inner-top-left border-b-[1px] border-[var(--text-color)]",
      filter:
        "font-semibold border-b-0 border-[1px] border-[var(--text-color)]",
    },
  };

  const handleViewClick = (tab) => {
    if (selectedView !== tab) {
      setSelectedView(tab);
      setSelectedArticle(null);
    }
  };

  return (
    <div className="flex bg-transparent">
      <button
        className={`w-1/3 desktop:w-auto px-2 desktop:px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] desktop:rounded-t-lg ${
          buttonStyles[selectedView]?.topics || ""
        }`}
        onClick={() => handleViewClick("topics")}
        disabled={selectedView === "topics"}
      >
        Topics
      </button>
      <button
        className={`w-1/3 desktop:w-auto px-2 desktop:px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--surface-color)] desktop:rounded-t-lg ${
          buttonStyles[selectedView]?.outlets || ""
        }`}
        onClick={() => handleViewClick("outlets")}
        disabled={selectedView === "outlets"}
      >
        Outlets
      </button>
      <button
        className={`w-1/3 desktop:w-auto px-2 desktop:px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] desktop:rounded-t-lg ${
          buttonStyles[selectedView]?.filter || ""
        }`}
        onClick={() => handleViewClick("filter")}
        disabled={selectedView === "filter"}
      >
        Filter
      </button>
      <div className="desktop:flex-1 desktop:border-b-[1px] desktop:border-r-0 desktop:border-[var(--text-color)]"></div>
    </div>
  );
}
