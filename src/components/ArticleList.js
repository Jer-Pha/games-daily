import React, { useState, useEffect, useRef, useCallback } from "react";
import Article from "./Article";
import ArticleDetails from "./ArticleDetails";
import { ARTICLE_TOLERANCE } from "./Constants";

export default function ArticleList({
  articles,
  sectionTopic,
  selectedArticle,
  onArticleClick,
  containerRef,
}) {
  const [expandCheck, setExpandCheck] = useState(false);
  const [showArticleDetails, setShowArticleDetails] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState("open");
  const articleRefs = useRef({});

  const handleClose = useCallback(() => {
    setDrawerStatus("close");
    setTimeout(() => {
      onArticleClick(null);
      setShowArticleDetails(false);
    }, 250);
  }, [onArticleClick]);

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

    // Check if the selected article is visible
    const checkArticleVisibility = () => {
      if (
        !container ||
        !selectedArticle ||
        !articleRefs.current[selectedArticle.id]
      )
        return;

      const containerRect = container.getBoundingClientRect();
      const articleRect =
        articleRefs.current[selectedArticle.id].getBoundingClientRect();

      const isVisible =
        articleRect.left >= containerRect.left &&
        articleRect.right <= containerRect.right;

      if (!isVisible) {
        handleClose(); // Close ArticleDetails if not visible
      }
    };

    // Initial call
    updateExpandCheck();

    // Check each time the container is resized
    const resizeObserver = new ResizeObserver(updateExpandCheck);
    if (container) resizeObserver.observe(container);

    // Check each time the container is scrolled
    const isScrollendSupported = "onscrollend" in container;
    if (isScrollendSupported) {
      container?.addEventListener("scrollend", checkArticleVisibility);
    } else {
      container?.addEventListener("scroll", checkArticleVisibility);
    }

    return () => {
      // Clean up event listeners
      resizeObserver.disconnect();
      if (isScrollendSupported) {
        container?.removeEventListener("scrollend", checkArticleVisibility);
      } else {
        container?.removeEventListener("scroll", checkArticleVisibility);
      }
    };
  }, [containerRef, articles, selectedArticle, handleClose]);

  const handleArticleClick = (article) => {
    onArticleClick(article, sectionTopic);
    setShowArticleDetails(true);
    setDrawerStatus("open");

    // Check if article is fully visible
    const container = containerRef.current;
    const articleRef = articleRefs.current[article.id];
    if (container && articleRef) {
      const containerRect = container.getBoundingClientRect();
      const articleRect = articleRef.getBoundingClientRect();

      if (articleRect.left < containerRect.left) {
        // Article is partially hidden on the left
        container.scrollBy({
          left: articleRect.left - containerRect.left,
          behavior: "smooth",
        });
      } else if (articleRect.right > containerRect.right + ARTICLE_TOLERANCE) {
        // Article is partially hidden on the right
        container.scrollBy({
          left: articleRect.right - containerRect.right,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide articles-container snap-x snap-mandatory"
      >
        <div
          className={
            expandCheck
              ? "flex gap-1 w-max tablet:w-auto article-row"
              : "flex gap-1 w-max article-row"
          }
        >
          {articles.map((article) => (
            <Article
              key={article.id}
              item={article}
              innerRef={(el) => (articleRefs.current[article.id] = el)}
              addClasses={`${
                expandCheck
                  ? "tablet:flex-1 tablet:flex-grow"
                  : "tablet:w-[article-card]"
              } ${
                selectedArticle && selectedArticle.id === article.id
                  ? "selected"
                  : ""
              }`}
              isSelected={selectedArticle && selectedArticle.id === article.id}
              onArticleClick={() => handleArticleClick(article)}
              handleClose={handleClose}
            />
          ))}
        </div>
      </div>
      {showArticleDetails &&
        selectedArticle &&
        selectedArticle.sectionTopic === sectionTopic && (
          <ArticleDetails
            item={selectedArticle}
            status={drawerStatus}
            onClose={handleClose}
          />
        )}
    </React.Fragment>
  );
}
