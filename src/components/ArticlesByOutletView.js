import React, { useRef } from "react";
import ArticleSection from "./ArticleSection";

export default function ArticlesByOutletView({
  outletSections,
  scrollContainerRef,
}) {
  console.log("render ArticlesByOutletView");
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content"
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
