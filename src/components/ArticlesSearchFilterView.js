import React, { useEffect, useState } from "react";
import ArticleFilterable from "./ArticleFilterable";
import ArticleFilterMenu from "./ArticleFilterMenu";

export default function ArticlesSearchFilterView({
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

  const filteredSections = loadedSections.filter((article) => {
    const outletMatch =
      selectedOutlets.length === 0 || selectedOutlets.includes(article.site);
    const topicMatch =
      selectedTopics.length === 0 || selectedTopics.includes(article.topic);
    return outletMatch && topicMatch;
  });

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
      <div className="hidden tablet:flex bg-[var(--bg-color)] p-4 min-h-[calc(100vh-36px)]">
        <ArticleFilterMenu
          topicData={topicData}
          outletNames={outletNames}
          selectedOutlets={selectedOutlets}
          setSelectedOutlets={setSelectedOutlets}
          setSelectedTopics={setSelectedTopics}
          selectedTopics={selectedTopics}
        />
        <div className="pl-64 desktop:pl-[336px] flex flex-wrap justify-around items-start h-min">
          {filteredSections.map((article) => (
            <ArticleFilterable article={article} key={article.id} />
          ))}
        </div>
      </div>
    </>
  );
}
