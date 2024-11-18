import React, { useState, useEffect } from "react";
import ArticlesByTopicView from "./ArticlesByTopicView";
import ArticlesBySiteView from "./ArticlesBySiteView";
import ArticlesSearchFilterView from "./ArticlesSearchFilterView";
import ViewButtonGroup from "./ViewButtonGroup";

export default function ArticleViewContainer() {
  const [error, setError] = useState(null);
  const [trendingNewsArticles, setTrendingNewsArticles] = useState([]);
  const [topicSections, setTopicSections] = useState([]);
  const [siteSections, setSiteSections] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [otherNewsArticles, setOtherArticles] = useState([]);
  const [selectedView, setSelectedView] = useState("topics");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [sliceSize, setSliceSize] = useState(6);

  // Fetch article data from API
  useEffect(() => {
    const fetchDataByTopic = async () => {
      try {
        const response = await fetch(
          "https://www.kfdb.app/api/news/articles-by-topic"
        );

        handleResize();

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
        setInitialDataLoaded(true);
      }
      function handleResize() {
        setSliceSize(Math.ceil(window.innerHeight / 224));
      }

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    };

    fetchDataByTopic();
  }, []);

  useEffect(() => {
    if (initialDataLoaded) {
      const fetchDataBySite = async () => {
        try {
          const response = await fetch(
            "https://www.kfdb.app/api/news/articles-by-site"
          );

          if (!response.ok) {
            throw new Error("Network response error");
          }

          const data = await response.json();

          setError(null);
          setSiteSections(data);

          const articles = Object.values(data).flat();

          articles.sort((a, b) => {
            if (a.weight !== b.weight) {
              return b.weight - a.weight; // Sort by weight in descending order
            } else {
              return a.id - b.id; // Sort by id in ascending order
            }
          });

          setAllArticles(articles);
        } catch (error) {
          setError(error);
        }
      };

      fetchDataBySite();
    }
  }, [initialDataLoaded]);

  const handleArticleClick = (article, sectionTopic) => {
    setSelectedArticle({ ...article, sectionTopic });
  };

  // Handle loading
  if (!initialDataLoaded) {
    return <div>Loading...</div>;
  }

  // Handle errors
  if (error) {
    return <div>Oops, something went wrong! Please refresh and try again.</div>;
  }

  return (
    <div className="bg-[var(--alt-color)]">
      <ViewButtonGroup
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
      <div className="flex flex-col relative overflow-hidden">
        {selectedView === "sites" && (
          <ArticlesBySiteView
            sliceSize={sliceSize}
            siteSections={siteSections}
            selectedArticle={selectedArticle}
            handleArticleClick={handleArticleClick}
          />
        )}
        {selectedView === "topics" && (
          <ArticlesByTopicView
            sliceSize={sliceSize - 2}
            trendingNewsArticles={trendingNewsArticles}
            topicSections={topicSections}
            otherNewsArticles={otherNewsArticles}
            selectedArticle={selectedArticle}
            handleArticleClick={handleArticleClick}
          />
        )}
        {selectedView === "filter" && (
          <ArticlesSearchFilterView
            sliceSize={sliceSize * 5}
            allArticles={allArticles}
          />
        )}
      </div>
    </div>
  );
}
