import React, { useState, useEffect } from "react";
import ArticlesByTopicView from "./ArticlesByTopicView";
import ArticlesBySiteView from "./ArticlesBySiteView";
import ArticlesSearchFilterView from "./ArticlesSearchFilterView";
import ViewButtonGroup from "./ViewButtonGroup";

export default function ArticleViewContainer() {
  const [error, setError] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [trendingNewsArticles, setTrendingNewsArticles] = useState([]);
  const [topicSections, setTopicSections] = useState([]);
  const [siteSections, setSiteSections] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [otherNewsArticles, setOtherArticles] = useState([]);
  const [sliceSize, setSliceSize] = useState(6);
  const [outletNames, setOutletNames] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [selectedView, setSelectedView] = useState("topics");
  const [selectedArticle, setSelectedArticle] = useState(null);

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
      const fetchSiteAndTopicData = async () => {
        try {
          const articlesResponse = await fetch(
            "https://www.kfdb.app/api/news/articles-by-site"
          );
          if (!articlesResponse.ok) {
            throw new Error("Network response error");
          }
          const articlesData = await articlesResponse.json();
          const outletNames = Object.keys(articlesData).map((outletName) => {
            const firstArticle = articlesData[outletName][0]; // Get the first article for the outlet
            const outletSlug = firstArticle.site; // Extract the site key (slugified version)
            return { name: outletName, slug: outletSlug }; // Return an object with both name and slug
          });

          const topicResponse = await fetch(
            "https://www.kfdb.app/api/news/topics"
          );
          if (!topicResponse.ok) {
            throw new Error("Network response error");
          }
          const topicData = await topicResponse.json();
          const topics = topicData.map((topic) => topic.topic);

          setError(null);

          const articlesAll = Object.values(articlesData).flat();

          articlesAll.sort((a, b) => {
            if (a.weight !== b.weight) {
              return b.weight - a.weight; // Sort by weight in descending order
            } else {
              return a.id - b.id; // Sort by id in ascending order
            }
          });

          setSiteSections(articlesData);
          setAllArticles(articlesAll);
          setOutletNames(outletNames);
          setTopicData(topics);
        } catch (error) {
          setError(error);
        }
      };

      fetchSiteAndTopicData();
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
      <ViewButtonGroup
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
      <div className="flex flex-col relative overflow-hidden">
        {selectedView === "outlets" && (
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
            sliceSize={sliceSize * 4}
            allArticles={allArticles}
            topicData={topicData}
            outletNames={outletNames}
          />
        )}
      </div>
    </div>
  );
}
