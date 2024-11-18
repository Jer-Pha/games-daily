import React from "react";

export default function ViewButtonGroup({ selectedView, setSelectedView }) {
  return (
    <div className="flex">
      <button
        className={`w-1/3 px-4 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--bg-color)] ${
          selectedView === "sites"
            ? "inner-bottom-right"
            : selectedView === "filter"
            ? "inner-bottom"
            : "font-semibold"
        }`}
        onClick={() => {
          selectedView !== "topics" && setSelectedView("topics");
        }}
        disabled={selectedView === "topics"}
      >
        Topics
      </button>
      <button
        className={`w-1/3 px-4 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--surface-color)] ${
          selectedView === "topics"
            ? "inner-bottom-left"
            : selectedView === "filter"
            ? "inner-bottom-right"
            : "font-semibold"
        }`}
        onClick={() => {
          selectedView !== "sites" && setSelectedView("sites");
        }}
        disabled={selectedView === "sites"}
      >
        Outlets
      </button>
      <button
        className={`w-1/3 px-4 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--alt-color)] ${
          selectedView === "topics"
            ? "inner-bottom"
            : selectedView === "sites"
            ? "inner-bottom-left"
            : "font-semibold"
        }`}
        onClick={() => {
          selectedView !== "filter" && setSelectedView("filter");
        }}
        disabled={selectedView === "filter"}
      >
        Filter&nbsp;/&nbsp;Search
      </button>
    </div>
  );
}
