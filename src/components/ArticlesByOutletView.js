import React, { useState, useEffect, useRef } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByOutletView({
  sliceSize,
  siteSections,
  previousView,
  clickedView,
  scrollContainerRef,
}) {
  const [loadedSections, setLoadedSections] = useState(
    Object.entries(siteSections).slice(0, sliceSize)
  );
  const [allSectionsLoaded, setAllSectionsLoaded] = useState(false);
  const containerRef = useRef(null);

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

  useEffect(() => {
    if (containerRef.current && previousView !== "outlets") {
      containerRef.current.classList.add("active");
    } else {
      if (clickedView === "topics") {
        containerRef.current.classList.add("right");
        containerRef.current.classList.remove("left");
      } else {
        containerRef.current.classList.add("left");
        containerRef.current.classList.remove("right");
      }
      containerRef.current.classList.remove("active");
    }
  }, [containerRef, previousView, clickedView]);

  return (
    <>
      <div
        ref={containerRef}
        className={`content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content ${
          previousView === "topics" ? "right" : "left"
        }`}
      >
        {siteSections &&
          loadedSections.map((section, index) => (
            <ArticleSection
              key={section[0]}
              articles={section[1]}
              sectionTopic={section[0]}
              backgroundColor={
                index % 2 !== 0
                  ? "bg-[var(--primary-color)]"
                  : "bg-[var(--surface-color)]"
              }
              scrollContainerRef={scrollContainerRef}
              sectionIdx={index}
            />
          ))}
      </div>
    </>
  );
}
