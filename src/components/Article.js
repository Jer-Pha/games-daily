import React, { useContext, useState, useEffect } from "react";
import { ArticleContext } from "../context/ArticleContext";
import LazyImage from "./LazyImage";
import * as Icons from "./Icons";

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

  return (
    <article
      className={`${addClasses} w-screen min-w-[calc(100vw-2px)] tablet:min-w-[article-card] cursor-pointer overflow-hidden border-y-2 border-x-2 border-transparent snap-start snap-always relative z-10 tablet:rounded-lg`}
      title={article.headline}
      onClick={handleClick}
    >
      <div>
        <LazyImage
          checkCache={checkCache}
          src={article.image}
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
      <div className="absolute top-0 left-0 bg-black/55 p-2 text-white tablet:rounded-tl-lg">
        <SvgIcon key={article.site} className="h-7 tablet:h-5" />
      </div>
    </article>
  );
}
