import React, { useEffect, useState, useContext, useRef } from "react";
import ArticlesByTopicView from "./ArticlesByTopicView";
import ArticlesByOutletView from "./ArticlesByOutletView";
import ArticlesByFilterView from "./ArticlesByFilterView";
import ViewButtonGroup from "./ViewButtonGroup";
import { ArticleContext } from "../context/ArticleContext";
import ArticleDetails from "./ArticleDetails";
import SkeletonView from "./SkeletonView";

export default function ArticleViewContainer() {
  const { selectedArticle } = useContext(ArticleContext);
  const [error, setError] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [trendingNewsArticles, setTrendingNewsArticles] = useState([]);
  const [topicSections, setTopicSections] = useState([]);
  const [outletSections, setOutletSections] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [otherNewsArticles, setOtherArticles] = useState([]);
  const [outletNames, setOutletNames] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [selectedView, setSelectedView] = useState("topics");
  const [previousView, setPreviousView] = useState(null);
  const [clickedView, setClickedView] = useState(null);
  const isInitialRender = useRef(true);
  const scrollContainerRef = useRef(null);

  // Fetch article data from API
  useEffect(() => {
    const fetchDataByTopic = async () => {
      try {
        const response = await fetch(
          "https://www.kfdb.app/api/news/articles-by-topic"
        );

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
            const firstArticle = articlesData[outletName][0];
            const outletSlug = firstArticle.site;
            return { name: outletName, slug: outletSlug };
          });

          const topicResponse = await fetch(
            "https://www.kfdb.app/api/news/topics"
          );
          if (!topicResponse.ok) {
            throw new Error("Network response error");
          }
          const topicData = await topicResponse.json();
          const topics = topicData.map((topic) => topic.topic);

          // Update keywordsMeta
          const keywords = topics.slice(0, 10).join(", ");
          const keywordsMeta = document.querySelector('meta[name="keywords"]');
          if (keywordsMeta) {
            keywordsMeta.content = keywords;
          }

          setError(null);

          const articlesAll = Object.values(articlesData).flat();

          articlesAll.sort((a, b) => {
            if (a.weight !== b.weight) {
              return b.weight - a.weight; // Sort by weight in descending order
            } else {
              return a.id - b.id; // Sort by id in ascending order
            }
          });

          setOutletSections(Object.entries(articlesData));
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

  useEffect(() => {
    if (isInitialRender.current && selectedView !== "topics") {
      isInitialRender.current = false;
    }
  }, [selectedView]);

  // Add delay to match slide animation
  const handleViewChange = (newView) => {
    setPreviousView(selectedView);
    setClickedView(newView);
    setTimeout(() => {
      setSelectedView(newView);
    }, 250);
  };

  // Handle loading (render skeleton view)
  if (!initialDataLoaded) {
    return <SkeletonView />;
  }

  // Handle errors
  if (error) {
    return <div>Oops, something went wrong! Please refresh and try again.</div>;
  }

  return (
    <>
      <div>
        <div className="flex flex-col desktop:items-center w-full overflow-y-auto gutter pr-1 tablet:pr-0">
          <ViewButtonGroup
            selectedView={selectedView}
            setSelectedView={handleViewChange}
          />
        </div>
        <div
          ref={scrollContainerRef}
          className="flex flex-col w-full desktop:items-center overflow-x-hidden overflow-y-auto gutter max-h-[calc(100vh-58px)] tablet:max-h-[calc(100vh-42px)] pr-1 tablet:pr-0"
        >
          {selectedView === "topics" && (
            <ArticlesByTopicView
              trendingNewsArticles={trendingNewsArticles}
              topicSections={topicSections}
              otherNewsArticles={otherNewsArticles}
              previousView={previousView}
              scrollContainerRef={scrollContainerRef}
              isInitialRender={isInitialRender}
            />
          )}
          {selectedView === "outlets" && (
            <ArticlesByOutletView
              outletSections={outletSections}
              previousView={previousView}
              clickedView={clickedView}
              scrollContainerRef={scrollContainerRef}
            />
          )}
          {selectedView === "filter" && (
            <ArticlesByFilterView
              allArticles={allArticles}
              topicData={topicData}
              outletNames={outletNames}
              previousView={previousView}
              scrollContainerRef={scrollContainerRef}
            />
          )}
        </div>
      </div>
      {selectedArticle && <ArticleDetails article={selectedArticle} />}
    </>
  );
}
