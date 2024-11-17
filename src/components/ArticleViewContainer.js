import React, { useState, useEffect, useRef } from "react";
import ArticlesByTopicView from "./ArticlesByTopicView";
import ArticlesBySiteView from "./ArticlesBySiteView";

export default function ArticleViewContainer() {
  const [error, setError] = useState(null);
  const [trendingNewsArticles, setTrendingNewsArticles] = useState([]);
  const [topicSections, setTopicSections] = useState([]);
  const [siteSections, setSiteSections] = useState([]);
  const [otherNewsArticles, setOtherArticles] = useState([]);
  const [selectedView, setSelectedView] = useState("topics");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [sliceSize, setSliceSize] = useState(6);
  const topicsButtonRef = useRef(null);
  const sitesButtonRef = useRef(null);

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
    <div>
      <div className="flex">
        <button
          ref={topicsButtonRef}
          className={`w-1/2 px-4 py-1 text-center bg-[var(--bg-color)] uppercase text-sm ${
            selectedView === "sites"
              ? "shadow-inner-bottom-right"
              : "font-semibold"
          }`}
          onClick={() => setSelectedView("topics")}
        >
          Topics{" "}
        </button>
        <button
          ref={sitesButtonRef}
          className={`w-1/2 px-4 py-3 tablet:py-1 text-center bg-[var(--surface-color)] uppercase text-md ${
            selectedView === "topics"
              ? "shadow-inner-bottom-left"
              : "font-semibold"
          }`}
          onClick={() => setSelectedView("sites")}
        >
          Outlets
        </button>
      </div>
      <div className="flex flex-col relative overflow-hidden">
        {selectedView === "sites" ? (
          <div className="article-view active">
            <ArticlesBySiteView
              sliceSize={sliceSize}
              siteSections={siteSections}
              selectedArticle={selectedArticle}
              handleArticleClick={handleArticleClick}
            />
          </div>
        ) : (
          <div className="article-view">
            <ArticlesByTopicView
              sliceSize={sliceSize - 2} // Exclude Trending/Other sections
              trendingNewsArticles={trendingNewsArticles}
              topicSections={topicSections}
              otherNewsArticles={otherNewsArticles}
              selectedArticle={selectedArticle}
              handleArticleClick={handleArticleClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
