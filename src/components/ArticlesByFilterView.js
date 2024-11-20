import React, { useEffect, useState } from "react";
import Article from "./Article";
import ArticleFilterMenu from "./ArticleFilterMenu";

import { ArrowLeftWideIcon } from "./Icons";

export default function ArticlesByFilterView({
  sliceSize,
  allArticles,
  topicData,
  outletNames,
}) {
  const [loadedSections, setLoadedSections] = useState(
    allArticles.slice(0, sliceSize)
  );
  const [allSectionsLoaded, setAllSectionsLoaded] = useState(false);
  const [selectedOutlets, setSelectedOutlets] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const filteredSections =
    selectedOutlets.length > 0 || selectedTopics.length > 0
      ? loadedSections.filter((article) => {
          const outletMatch =
            selectedOutlets.length === 0 ||
            selectedOutlets.includes(article.site);
          const topicMatch =
            selectedTopics.length === 0 ||
            selectedTopics.includes(article.topic);
          return outletMatch && topicMatch;
        })
      : [];

  useEffect(() => {
    if (allArticles && !allSectionsLoaded && loadedSections) {
      const sectionsToLoad = allArticles.slice(
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
  }, [allArticles, loadedSections, sliceSize, allSectionsLoaded]);

  return (
    <>
      <div className="block tablet:hidden p-4">
        <p>
          Filter view is not available on mobile yet. Please use a larger
          device.
        </p>
      </div>
      <div className="hidden tablet:flex flex-1 min-h-[calc(100vh-58px)] tablet:min-h-[calc(100vh-42px)]">
        <ArticleFilterMenu
          topicData={topicData}
          outletNames={outletNames}
          selectedOutlets={selectedOutlets}
          setSelectedOutlets={setSelectedOutlets}
          setSelectedTopics={setSelectedTopics}
          selectedTopics={selectedTopics}
        />
        <div
          className={`flex flex-wrap justify-around items-start w-full overflow-y-auto ${
            filteredSections.length === 0
              ? "min-h-[calc(100vh-90px)] tablet:min-h-[calc(100vh-74px)] content-center"
              : ""
          }`}
        >
          {filteredSections.length > 0 ? (
            filteredSections.map((article) => (
              <Article
                article={article}
                key={article.id}
                addClasses="tablet:max-h-[article-img] tablet:mb-4 w-screen tablet:w-[article-card]"
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <p className="text-lg p-2">
                Select a filter option to get started
              </p>
              <div className="animate-bounce h-10 w-10">
                <ArrowLeftWideIcon />
              </div>
            </div>
          )}
        </div>{" "}
      </div>
    </>
  );
}
