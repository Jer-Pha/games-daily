import React, { useState, useContext, useRef } from "react";
import { ArticleContext } from "../context/ArticleContext";
import Article from "./Article";
import ArticleFilterMenu from "./ArticleFilterMenu";

import { ArrowLeftWideIcon } from "../utils/Icons";

export default function ArticlesByFilterView({
  allArticles,
  topicData,
  outletNames,
  scrollContainerRef,
}) {
  const { selectedArticle } = useContext(ArticleContext);
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const containerRef = useRef(null);
  const viewRef = useRef(null);

  const filteredSections =
    selectedOutlets.length > 0 || selectedTopics.length > 0
      ? allArticles.filter((article) => {
          const outletMatch =
            selectedOutlets.length === 0 ||
            selectedOutlets.includes(article.site);
          const topicMatch =
            selectedTopics.length === 0 ||
            selectedTopics.includes(article.topic);
          return outletMatch && topicMatch;
        })
      : [];

  return (
    <div
      ref={viewRef}
      className="flex min-h-[calc(100vh-58px)] tablet:min-h-[calc(100vh-42px)] content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content bg-[var(--primary-color)]`"
    >
      <ArticleFilterMenu
        topicData={topicData}
        outletNames={outletNames}
        selectedOutlets={selectedOutlets}
        setSelectedOutlets={setSelectedOutlets}
        setSelectedTopics={setSelectedTopics}
        selectedTopics={selectedTopics}
      />
      <div
        ref={containerRef}
        className={`flex flex-wrap justify-around flex-1 overflow-y-auto p-4 desktop:ml-80 ${
          filteredSections.length === 0
            ? "min-h-[calc(100vh-89px)] tablet:min-h-[calc(100vh-73px)] content-center"
            : "content-start"
        }`}
      >
        {filteredSections.length > 0 ? (
          filteredSections.map((article) => (
            <Article
              article={article}
              key={article.id}
              scrollContainerRef={scrollContainerRef}
              addClasses={`tablet:max-h-[article-img] tablet:mb-4 w-screen tablet:w-[article-card] ${
                selectedArticle && selectedArticle.id === article.id
                  ? "selected"
                  : ""
              }`}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-lg p-2">Select a filter option to get started</p>
            <div className="animate-bounce h-10 w-10">
              <ArrowLeftWideIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
