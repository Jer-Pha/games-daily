import React, { useState, useEffect, useContext } from "react";
import { ArticleContext } from "../context/ArticleContext";
import Article from "./Article";

export default function ArticleList({
  sectionIdx,
  articles,
  containerRef,
  articleRowRef,
  scrollContainerRef,
  containerWidth,
  articleRowWidth,
}) {
  const { selectedArticle } = useContext(ArticleContext);
  const [expandCheck, setExpandCheck] = useState(false);

  useEffect(() => {
    // Check if the articles need to be expanded
    const updateExpandCheck = () => {
      if (!containerWidth || !articleRowWidth) return;

      setExpandCheck(articleRowWidth <= containerWidth);
    };

    // Initial call
    updateExpandCheck();
  }, [containerWidth, articleRowWidth, articles]);

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide articles-container snap-x snap-mandatory"
      >
        <div
          ref={articleRowRef}
          className={`flex gap-0 tablet:gap-1 w-max article-row ${
            expandCheck ? "tablet:w-auto" : ""
          }`}
        >
          {articles.map((article, index) => (
            <Article
              key={article.id}
              articleIdx={index}
              sectionIdx={sectionIdx}
              article={article}
              scrollContainerRef={scrollContainerRef}
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
    </>
  );
}
