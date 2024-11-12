import React, { useRef, useEffect, useCallback, useState } from "react";
import ArticleList from "./ArticleList";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";
import { ARROW_OPACITY, ARTICLE_TOLERANCE, ARTICLE_WIDTH } from "./Constants";

export default function ArticleSection({
  title,
  articles,
  sectionTopic,
  backgroundColor,
  selectedArticle,
  onArticleClick,
}) {
  const containerRef = useRef(null);
  const [arrowBtnDisplayKey, setArrowBtnDisplayKey] = useState({});

  // Check if scrolling buttons are needed
  useEffect(() => {
    const container = containerRef?.current;

    const updateArrowBtnDisplay = () => {
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const articleRow = container.querySelector(".article-row");
      const articleRowWidth = articleRow ? articleRow.offsetWidth : 0;

      setArrowBtnDisplayKey({
        showLeft: container.scrollLeft > 0,
        showRight:
          container.scrollLeft + containerWidth <
          articleRowWidth - ARTICLE_TOLERANCE,
      });
    };

    // Initial check
    updateArrowBtnDisplay();

    // Check each time the window is resized
    window.addEventListener("resize", updateArrowBtnDisplay);

    // Check scroll button display when container scrolls
    container?.addEventListener("scroll", updateArrowBtnDisplay);

    return () => {
      // Clean up event listeners
      window.removeEventListener("resize", updateArrowBtnDisplay);
      container?.removeEventListener("scroll", updateArrowBtnDisplay);
    };
  }, [articles]);

  // Scroll functions
  const scrollArticleList = useCallback((dir) => {
    containerRef.current.scrollBy({
      left: (ARTICLE_WIDTH + 4) * dir, // gap: 4px
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      id={sectionTopic}
      className={`tablet:px-4 pb-4 relative ${backgroundColor}`}
    >
      <h2 className="text-2xl font-semibold text-left py-2 pl-4 tablet:px-0">
        {title}
      </h2>
      <ArticleList
        articles={articles}
        sectionTopic={sectionTopic}
        selectedArticle={selectedArticle}
        onArticleClick={onArticleClick}
        containerRef={containerRef}
        scrollArticleList={scrollArticleList}
      />

      {arrowBtnDisplayKey && arrowBtnDisplayKey?.showLeft && (
        <button
          className={`arrow-left ${ARROW_OPACITY}`}
          onClick={() => scrollArticleList(-1)}
        >
          <ArrowLeftIcon />
        </button>
      )}
      {arrowBtnDisplayKey && arrowBtnDisplayKey?.showRight && (
        <button
          className={`arrow-right ${ARROW_OPACITY}`}
          onClick={() => scrollArticleList(1)}
        >
          <ArrowRightIcon />
        </button>
      )}
    </section>
  );
}
