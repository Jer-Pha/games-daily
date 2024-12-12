import React, { useRef, useEffect, useCallback, useState } from "react";
import ArticleList from "./ArticleList";
import { ArrowLeftIcon, ArrowRightIcon } from "../utils/Icons";
import {
  ARROW_OPACITY,
  ARTICLE_TOLERANCE,
  ARTICLE_WIDTH,
} from "../utils/Constants";
import { sanitizeId } from "../utils/utils";

export default function ArticleSection({
  sectionIdx,
  articles,
  sectionTopic,
  backgroundColor,
  scrollContainerRef,
}) {
  // console.log("render ArticleSection");
  const containerRef = useRef(null);
  const articleRowRef = useRef(null);
  const [arrowBtnDisplayKey, setArrowBtnDisplayKey] = useState({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [articleRowWidth, setArticleRowWidth] = useState(0);

  // Check if scrolling buttons are needed
  useEffect(() => {
    const container = containerRef?.current;
    const articleRow = articleRowRef?.current;

    const updateArrowBtnDisplay = () => {
      if (!container || !articleRow) return;

      setContainerWidth(container.offsetWidth);
      setArticleRowWidth(articleRow.offsetWidth);

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
    const resizeObserver = new ResizeObserver(updateArrowBtnDisplay);
    if (container) {
      resizeObserver.observe(container);
    }

    // Check scroll button display when container scrolls
    container?.addEventListener("scroll", updateArrowBtnDisplay);

    return () => {
      // Clean up event listeners
      resizeObserver.disconnect();
      container?.removeEventListener("scroll", updateArrowBtnDisplay);
    };
  }, [articleRowWidth, containerWidth]);

  // Scroll functions
  const scrollArticleList = useCallback((dir) => {
    containerRef.current.scrollBy({
      left: ARTICLE_WIDTH * dir,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      id={sanitizeId(sectionTopic)}
      className={`tablet:px-4 pb-4 relative w-full ${backgroundColor}`}
    >
      <h2 className="text-xl tablet:text-2xl font-semibold text-left py-2 pl-4 tablet:px-0">
        {sectionTopic}
      </h2>
      <ArticleList
        sectionIdx={sectionIdx}
        articles={articles}
        containerRef={containerRef}
        articleRowRef={articleRowRef}
        scrollArticleList={scrollArticleList}
        scrollContainerRef={scrollContainerRef}
        containerWidth={containerWidth}
        articleRowWidth={articleRowWidth}
      />

      {arrowBtnDisplayKey && arrowBtnDisplayKey?.showLeft && (
        <button
          className={`arrow-left z-50 h-8 w-8 ${ARROW_OPACITY}`}
          onClick={() => scrollArticleList(-1)}
          type="button"
          aria-label="Scroll left"
          tabIndex="-1"
        >
          <ArrowLeftIcon />
        </button>
      )}
      {arrowBtnDisplayKey && arrowBtnDisplayKey?.showRight && (
        <button
          className={`arrow-right z-50 h-8 w-8 ${ARROW_OPACITY}`}
          onClick={() => scrollArticleList(1)}
          type="button"
          aria-label="Scroll right"
          tabIndex="-1"
        >
          <ArrowRightIcon />
        </button>
      )}
    </section>
  );
}
