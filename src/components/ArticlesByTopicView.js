import React, { useEffect, useRef } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByTopicView({
  trendingNewsArticles,
  topicSections,
  otherNewsArticles,
  previousView,
  scrollContainerRef,
  isInitialRender,
}) {
  const containerRef = useRef(null);

  console.log("render view: topics");

  useEffect(() => {
    if (
      containerRef.current &&
      !containerRef.current.className.includes("active")
    ) {
      containerRef.current.classList.add("active");
    } else if (
      previousView === "topics" &&
      containerRef.current.className.includes("active")
    ) {
      containerRef.current.classList.remove("active");
    }
    if (containerRef.current.className.includes("init")) {
      containerRef.current.classList.remove("init");
    }
  }, [containerRef, previousView]);

  return (
    <div
      ref={containerRef}
      className={`content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content left ${
        isInitialRender.current ? "init" : ""
      }`}
    >
      {/* Trending News */}
      <ArticleSection // Use ArticleSection component
        articles={trendingNewsArticles}
        sectionTopic="Trending News"
        backgroundColor="bg-[var(--primary-color)]"
        scrollContainerRef={scrollContainerRef}
        sectionIdx={0}
      />
      {/* Topic Sections */}
      {topicSections.map((section, index) => (
        <ArticleSection
          key={section.topic}
          articles={section.articles}
          sectionTopic={section.topic}
          backgroundColor={
            index % 2 === 0
              ? "bg-[var(--surface-color)]"
              : "bg-[var(--primary-color)]"
          }
          scrollContainerRef={scrollContainerRef}
          sectionIdx={index + 1}
        />
      ))}
      {/* Other News */}
      <ArticleSection
        articles={otherNewsArticles}
        sectionTopic="Other News"
        backgroundColor=""
        scrollContainerRef={scrollContainerRef}
        sectionIdx={99}
      />
    </div>
  );
}
