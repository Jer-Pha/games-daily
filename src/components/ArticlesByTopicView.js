import React, { useEffect, useState, useRef } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByTopicView({
  sliceSize,
  trendingNewsArticles,
  topicSections,
  otherNewsArticles,
  previousView,
  scrollContainerRef,
}) {
  const [loadedSections, setLoadedSections] = useState(
    topicSections.slice(0, sliceSize)
  );
  const [allSectionsLoaded, setAllSectionsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (topicSections && !allSectionsLoaded && loadedSections) {
      const sectionsToLoad = topicSections.slice(
        loadedSections.length,
        loadedSections.length + sliceSize
      );

      if (sectionsToLoad.length > 0) {
        setLoadedSections((prevLoadedSections) => {
          // Check if sectionsToLoad are already in prevLoadedSections
          const areSectionsLoaded = sectionsToLoad.every((section) =>
            prevLoadedSections.some(
              (existingSection) => existingSection.topic === section.topic
            )
          );

          if (!areSectionsLoaded) {
            return [...prevLoadedSections, ...sectionsToLoad];
          } else {
            return prevLoadedSections;
          }
        });
      } else {
        setAllSectionsLoaded(true);
      }
    }
  }, [topicSections, loadedSections, sliceSize, allSectionsLoaded]);

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
  }, [containerRef, previousView]);

  return (
    <>
      <div
        ref={containerRef}
        className="content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content left"
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
        {loadedSections.map((section, index) => (
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
    </>
  );
}
