import React, { useRef } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByTopicView({
  trendingNewsArticles,
  topicSections,
  otherNewsArticles,
  scrollContainerRef,
}) {
  console.log("render ArticlesByTopicView");
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content"
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
        backgroundColor={
          topicSections.length % 2 === 0
            ? "bg-[var(--surface-color)]"
            : "bg-[var(--primary-color)]"
        }
        scrollContainerRef={scrollContainerRef}
        sectionIdx={99}
      />
    </div>
  );
}
