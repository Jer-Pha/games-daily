import React, { useEffect, useState } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByTopicView({
  sliceSize,
  trendingNewsArticles,
  topicSections,
  otherNewsArticles,
}) {
  const [loadedSections, setLoadedSections] = useState(
    topicSections.slice(0, sliceSize)
  );
  const [allSectionsLoaded, setAllSectionsLoaded] = useState(false);

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

  return (
    <>
      <div className="bg-[var(--primary-color)] overflow-y-auto ">
        {/* Trending News */}
        <ArticleSection // Use ArticleSection component
          articles={trendingNewsArticles}
          sectionTopic="Trending News"
          backgroundColor="bg-[var(--primary-color)]"
        />
        {/* Topic Sections */}
        {loadedSections.map((section, index) => (
          <ArticleSection
            key={section.topic}
            articles={section.articles}
            sectionTopic={section.topic}
            backgroundColor={index % 2 === 0 ? "bg-[var(--surface-color)]" : ""}
          />
        ))}
        {/* Other News */}
        <ArticleSection
          articles={otherNewsArticles}
          sectionTopic="Other News"
          backgroundColor=""
        />
      </div>
    </>
  );
}
