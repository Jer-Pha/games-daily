import React, { useRef, useEffect, useCallback, useState } from "react";
import ArticleList from "./ArticleList";
import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";
import { ARROW_OPACITY } from "./Constants";

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
        showRight: container.scrollLeft + containerWidth < articleRowWidth,
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
  const scrollLeft = useCallback(() => {
    containerRef.current.scrollLeft -= 308;
  }, []);

  const scrollRight = useCallback(() => {
    containerRef.current.scrollLeft += 308;
  }, []);

  return (
    <section className={`px-4 pb-4 relative ${backgroundColor}`}>
      <h2 className="text-2xl font-semibold text-left py-2">{title}</h2>
      <ArticleList
        articles={articles}
        sectionTopic={sectionTopic}
        selectedArticle={selectedArticle}
        onArticleClick={onArticleClick}
        containerRef={containerRef}
      />

      {arrowBtnDisplayKey && arrowBtnDisplayKey?.showLeft && (
        <button
          className={`arrow-left ${ARROW_OPACITY}`}
          onClick={() => scrollLeft(containerRef)}
        >
          <ArrowLeftIcon />
        </button>
      )}
      {arrowBtnDisplayKey && arrowBtnDisplayKey?.showRight && (
        <button
          className={`arrow-right ${ARROW_OPACITY}`}
          onClick={() => scrollRight(containerRef)}
        >
          <ArrowRightIcon />
        </button>
      )}
    </section>
  );
}
