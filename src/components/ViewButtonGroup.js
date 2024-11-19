import React from "react";

export default function ViewButtonGroup({ selectedView, setSelectedView }) {
  const buttonStyles = {
    topics: {
      topics: "font-semibold",
      outlets: "inner-bottom-left",
      filter: "inner-bottom",
    },
    outlets: {
      topics: "inner-bottom-right",
      outlets: "font-semibold",
      filter: "inner-bottom-left",
    },
    filter: {
      topics: "inner-bottom",
      outlets: "inner-bottom-right",
      filter: "font-semibold",
    },
  };

  return (
    <div className="flex bg-transparent">
      <button
        className={`w-1/3 desktop:w-auto px-2 desktop:px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--bg-color)] ${
          buttonStyles[selectedView]?.topics || ""
        }`}
        onClick={() => {
          selectedView !== "topics" && setSelectedView("topics");
        }}
        disabled={selectedView === "topics"}
      >
        Topics
      </button>
      <button
        className={`w-1/3 desktop:w-auto px-2 desktop:px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--surface-color)] ${
          buttonStyles[selectedView]?.outlets || ""
        }`}
        onClick={() => {
          selectedView !== "outlets" && setSelectedView("outlets");
        }}
        disabled={selectedView === "outlets"}
      >
        Outlets
      </button>
      <button
        className={`w-1/3 desktop:w-auto px-2 desktop:px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--bg-color)] ${
          buttonStyles[selectedView]?.filter || ""
        }`}
        onClick={() => {
          selectedView !== "filter" && setSelectedView("filter");
        }}
        disabled={selectedView === "filter"}
      >
        Filter
      </button>
      <div
        className={`desktop:flex-1 ${
          selectedView === "filter"
            ? "desktop:inner-bottom-left"
            : "desktop:inner-bottom"
        }`}
      ></div>
    </div>
  );
}
