import React, { useEffect, useRef } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByOutletView({
  outletSections,
  previousView,
  clickedView,
  scrollContainerRef,
}) {
  const containerRef = useRef(null);

  console.log("render view: outlets");

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
    <div
      ref={containerRef}
      className={`content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content ${
        previousView === "topics" ? "right" : "left"
      }`}
    >
      {outletSections &&
        outletSections.map((section, index) => (
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
  );
}
