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
      className={`${addClasses} w-screen min-w-[100vw] tablet:min-w-[article-card] cursor-pointer pb-1.5 overflow-hidden border-2 border-transparent snap-start snap-always`}
      onClick={handleClick}
      ref={innerRef}
    >
      <img
        src={item.image}
        alt={item.headline}
        className="w-full aspect-video object-cover tablet:max-h-[article-img] border-b-2 border-transparent"
        loading="lazy"
      />
      <div className="flex flex-col">
        <h3 className="pt-1 px-1.5 text-sm font-semibold line-clamp-2 align-middle">
          {item.headline}
        </h3>
      </div>
    </article>
  );
}
