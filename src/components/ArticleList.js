import React, { useState, useEffect } from "react";
import Article from "./Article";
import ArticleDetails from "./ArticleDetails";

export default function ArticleList({
  articles,
  sectionTopic,
  selectedArticle,
  onArticleClick,
  containerRef,
}) {
  const [expandCheck, setExpandCheck] = useState(false);
  const [showArticleDetails, setShowArticleDetails] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

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
    if (container) resizeObserver.observe(container);

    return () => {
      // Clean up event listeners
      resizeObserver.disconnect();
    };
  }, [containerRef, articles]);

  const handleArticleClick = (article) => {
    onArticleClick(article, sectionTopic);
    setShowArticleDetails(true);
  };

  const handleClose = () => {
    onArticleClick(null);
    setShowArticleDetails(false);
  };

  return (
    <React.Fragment>
      <div ref={containerRef} className="overflow-hidden articles-container">
        <div
          className={
            expandCheck
              ? "flex gap-2 article-row"
              : "flex gap-2 w-max article-row"
          }
        >
          {articles.map((article) => (
            <Article
              key={article.id}
              item={article}
              addClasses={expandCheck ? "flex-1 flex-grow" : "w-[article-card]"}
              isSelected={selectedArticle && selectedArticle.id === article.id}
              onArticleClick={() => handleArticleClick(article)}
              handleClose={handleClose}
            />
          ))}
        </div>
      </div>
      {showArticleDetails &&
        selectedArticle &&
        selectedArticle.sectionTopic === sectionTopic && ( // Check sectionTopic
          <ArticleDetails item={selectedArticle} onClose={handleClose} />
        )}
    </React.Fragment>
  );
}
