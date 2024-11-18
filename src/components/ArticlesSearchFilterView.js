import React, { useEffect, useState } from "react";
import ArticleFilterSearchable from "./ArticleFilterSearchable";

export default function ArticlesSearchFilterView({ sliceSize, allArticles }) {
  const [loadedSections, setLoadedSections] = useState(
    allArticles.slice(0, sliceSize)
  );
  const [allSectionsLoaded, setAllSectionsLoaded] = useState(false);

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
    <div>
      <p className="p-4 text-sm">
        Search/Filter coming soon...
        <br />
        For now, here are all of the articles:
      </p>
      <div className="flex flex-wrap">
        {loadedSections.map((article) => (
          <ArticleFilterSearchable article={article} />
        ))}
      </div>
    </div>
  );
}
