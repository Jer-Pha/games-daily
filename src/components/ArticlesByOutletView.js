import React, { useState, useEffect } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByOutletView({ sliceSize, siteSections }) {
  const [loadedSections, setLoadedSections] = useState(
    Object.entries(siteSections).slice(0, sliceSize)
  );
  const [allSectionsLoaded, setAllSectionsLoaded] = useState(false);

  useEffect(() => {
    if (siteSections && !allSectionsLoaded && loadedSections) {
      const sectionsToLoad = Object.entries(siteSections).slice(
        loadedSections.length,
        loadedSections.length + sliceSize
      );

      if (sectionsToLoad.length > 0) {
        setLoadedSections((prevLoadedSections) => {
          // Check if sectionsToLoad are already in prevLoadedSections
          const areSectionsLoaded = sectionsToLoad.every(([sectionKey]) =>
            prevLoadedSections.some(
              ([existingKey]) => existingKey === sectionKey
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
  }, [siteSections, loadedSections, sliceSize, allSectionsLoaded]);

  return (
    <>
      <div className="bg-[var(--surface-color)] max-h-[calc(100vh-58px)] tablet:max-h-[calc(100vh-42px)] overflow-y-auto overflow-x-hidden ">
        {siteSections &&
          loadedSections.map((section, index) => (
            <ArticleSection
              key={section[0]}
              articles={section[1]}
              sectionTopic={section[0]}
              backgroundColor={
                index % 2 !== 0 ? "bg-[var(--primary-color)]" : ""
              }
            />
          ))}
      </div>
    </>
  );
}
