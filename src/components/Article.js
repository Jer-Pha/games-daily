import React, { useContext, useState, useEffect, useRef } from "react";
import { ArticleContext } from "../context/ArticleContext";
import LazyImage from "./LazyImage";
import * as Icons from "../utils/Icons";
import { SITES } from "../utils/Constants";

export default function Article({
  articleIdx,
  sectionIdx,
  article,
  addClasses,
  scrollContainerRef,
}) {
  const { setSelectedArticle, selectedArticle } = useContext(ArticleContext);
  const SvgIcon = Icons[article.site] || (() => <div></div>);
  const [checkCache, setCheckCache] = useState(false);
  const touchTimer = useRef(null);
  const TOUCH_HOLD_DELAY = 350;

  const handleClick = () => {
    if (selectedArticle && selectedArticle.id === article.id) {
      setSelectedArticle(null);
    } else {
      setSelectedArticle(article);
    }
  };

  useEffect(() => {
    if (sectionIdx <= 4 && articleIdx <= 4) {
      setCheckCache(true);
    }
  }, [sectionIdx, articleIdx, setCheckCache]);

  const handleKeyDown = (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent default spacebar/enter behavior
      handleClick();
    }
  };

  const handlePointerDown = (event) => {
    touchTimer.current = setTimeout(() => {
      event.preventDefault();
    }, TOUCH_HOLD_DELAY);
  };

  const handlePointerUp = () => {
    clearTimeout(touchTimer.current);
  };

  const handlePointerLeave = () => {
    clearTimeout(touchTimer.current);
  };

  return (
    <article
      className={`${addClasses} w-[calc(100vw-8px)] tablet:min-w-[article-card] cursor-pointer overflow-hidden border-y-2 border-x-2 border-transparent snap-start snap-always relative z-10 tablet:rounded-lg touch-manipulation`}
      title={article.headline}
      tabIndex="0"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div>
        <LazyImage
          checkCache={checkCache}
          src={
            article["image-412"]
              ? `/media/${article["image-412"]}`
              : article.image
          }
          srcSet={`/media/${article["image-296"]} 296w, /media/${article["image-412"]} 412w`}
          sizes="(max-width: 549px) 537px, 296px"
          alt={article.headline}
          className="w-full aspect-video object-cover tablet:max-h-[article-img] z-10 tablet:rounded-lg"
          scrollContainerRef={scrollContainerRef}
          color={article.color}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black/55 p-2 border-y-2 border-transparent tablet:rounded-b-lg">
        <h3 className="text-white text-xs font-semibold line-clamp-1">
          {article.headline}
        </h3>
      </div>
      <div
        className="absolute top-0 left-0 bg-black/55 p-2 text-white tablet:rounded-tl-lg"
        title={SITES[article.site]}
      >
        <SvgIcon key={article.site} className="h-7 tablet:h-5" />
      </div>
    </article>
  );
}
