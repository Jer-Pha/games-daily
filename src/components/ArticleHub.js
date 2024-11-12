import React, { useState, useEffect } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticleHub({ searchQuery }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingNewsArticles, setTrendingNewsArticles] = useState([]);
  const [topicSections, setTopicSections] = useState([]);
  const [otherNewsArticles, setOtherArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch article data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://www.kfdb.app/api/news/articles");

        if (!response.ok) {
          throw new Error("Network response error");
        }

        const data = await response.json();

        setError(null);
        setTrendingNewsArticles(data.trending);
        setTopicSections(data.sections);
        setOtherArticles(data.remaining);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleArticleClick = (article, sectionTopic) => {
    setSelectedArticle({ ...article, sectionTopic });
  };

  // Handle loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle errors
  if (error) {
    return <div>Oops, something went wrong! Please refresh and try again.</div>;
  }

  return (
    <div>
      {/* Trending News */}
      <ArticleSection // Use ArticleSection component
        title="Trending News"
        articles={trendingNewsArticles}
        sectionTopic="trending"
        backgroundColor="bg-[var(--bg-color)]"
        selectedArticle={selectedArticle}
        onArticleClick={(article) => handleArticleClick(article, "trending")}
      />

      {/* Topic Sections */}
      {topicSections.map((section, index) => (
        <ArticleSection
          key={section.topic}
          title={section.topic}
          articles={section.articles}
          sectionTopic={section.topic}
          backgroundColor={
            index % 2 === 0 ? "bg-[var(--surface-color)]" : "-[var(--bg-color)]"
          }
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
