import React, { useState, useEffect, useContext } from "react";
import { ArticleContext } from "../context/ArticleContext";
import Article from "./Article";

export default function ArticleList({ articles, containerRef }) {
  const { selectedArticle } = useContext(ArticleContext);
  const [expandCheck, setExpandCheck] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    // Check if the articles need to be expanded
    const updateExpandCheck = () => {
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const articleRow = container.querySelector(".article-row");
      const articleRowWidth = articleRow ? articleRow.offsetWidth : 0;

      setExpandCheck(articleRowWidth <= containerWidth);
    };

    // Initial call
    updateExpandCheck();

    // Check each time the container is resized
    const resizeObserver = new ResizeObserver(updateExpandCheck);
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      // Clean up event listeners
      resizeObserver.disconnect();
    };
  }, [containerRef, articles]);

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide articles-container snap-x snap-mandatory"
      >
        <div
          className={`flex gap-0 tablet:gap-1 w-max article-row ${
            expandCheck ? "tablet:w-auto" : ""
          }`}
        >
          {articles.map((article) => (
            <Article
              key={article.id}
              article={article}
              addClasses={`${
                expandCheck
                  ? "tablet:flex-1 tablet:flex-grow"
                  : "tablet:w-[article-card]"
              } ${
                selectedArticle && selectedArticle.id === article.id
                  ? "selected"
                  : ""
              }`}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
