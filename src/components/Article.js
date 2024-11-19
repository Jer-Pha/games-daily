import React from "react";
import * as Icons from "./Icons";

export default function Article({
  item,
  addClasses,
  onArticleClick,
  isSelected,
  handleClose,
  innerRef,
}) {
  const SvgIcon = Icons[item.site] || (() => <div></div>);

  const handleClick = () => {
    if (isSelected) {
      handleClose();
    } else {
      onArticleClick(item);
    }
  };

  return (
    <article
      className={`${addClasses} w-screen min-w-[100vw] tablet:min-w-[article-card] cursor-pointer overflow-hidden border-y-2 border-x-2 border-transparent snap-start snap-always relative z-10`}
      onClick={handleClick}
      ref={innerRef}
    >
      <div>
        <img
          src={item.image}
          alt={item.headline}
          className="w-full aspect-video object-cover tablet:max-h-[article-img] z-10"
          loading="lazy"
        />
        <div
          className="absolute left-0 top-0 w-full h-full blur-[40px] -z-10 animate-pulse slow"
          style={{ backgroundColor: item.color }}
        ></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black/55 p-2 border-y-2 border-transparent">
        <h3 className="text-white text-xs font-semibold line-clamp-1">
          {item.headline}
        </h3>
      </div>
      <div className="absolute top-0 left-0 bg-black/55 p-2 text-white">
        <SvgIcon key={item.site} className="h-7 tablet:h-5" />
      </div>
    </article>
  );
}
