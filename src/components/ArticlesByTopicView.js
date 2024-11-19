import React, { useEffect, useState } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByTopicView({
  sliceSize,
  trendingNewsArticles,
  topicSections,
  otherNewsArticles,
  selectedArticle,
  handleArticleClick,
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
    <div className="bg-[var(--primary-color)]">
      {/* Trending News */}
      <ArticleSection // Use ArticleSection component
        title="Trending News"
        articles={trendingNewsArticles}
        sectionTopic="trending"
        backgroundColor="bg-[var(--primary-color)]"
        selectedArticle={selectedArticle}
        onArticleClick={(article) => handleArticleClick(article, "trending")}
      />
      {/* Topic Sections */}
      {loadedSections.map((section, index) => (
        <ArticleSection
          key={section.topic}
          title={section.topic}
          articles={section.articles}
          sectionTopic={section.topic}
          backgroundColor={index % 2 === 0 ? "bg-[var(--surface-color)]" : ""}
          selectedArticle={selectedArticle}
          onArticleClick={(article) =>
            handleArticleClick(article, section.topic)
          }
        />
      ))}
      {/* Other News */}
      <ArticleSection
        title="Other News"
        articles={otherNewsArticles}
        sectionTopic="other"
        backgroundColor=""
        selectedArticle={selectedArticle}
        onArticleClick={(article) => handleArticleClick(article, "other")}
      />
    </div>
  );
}
