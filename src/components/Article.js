// import { motion } from "framer-motion";
import React from "react";

export default function Article({
  item,
  addClasses,
  onArticleClick,
  isSelected,
  handleClose,
  innerRef,
}) {
  const handleClick = () => {
    if (isSelected) {
      handleClose();
    } else {
      onArticleClick(item);
    }
  };

  return (
    <article
      className={`${addClasses} w-screen min-w-[100vw] tablet:min-w-[article-card] cursor-pointer overflow-hidden border-t-2 border-x-2 border-transparent snap-start snap-always relative z-10`}
      onClick={handleClick}
      ref={innerRef}
    >
      <img
        src={item.image}
        alt={item.headline}
        className="w-full aspect-video object-cover tablet:max-h-[article-img]"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/55 p-2 border-t-2 border-transparent">
        <h3 className="text-white text-xs font-semibold line-clamp-1">
          {item.headline}
        </h3>
      </div>
    </article>
  );
}
