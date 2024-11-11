// import { motion } from "framer-motion";
import React from "react";

export default function Article({
  item,
  addClasses,
  onArticleClick,
  isSelected,
  handleClose,
}) {
  const handleClick = () => {
    if (isSelected) {
      handleClose();
    } else {
      onArticleClick(item);
    }
  };

  return (
    <article className={`${addClasses} cursor-pointer`} onClick={handleClick}>
      <img
        src={item.image}
        alt={item.headline}
        className="w-full aspect-video object-cover max-h-[article-img]"
        loading="lazy"
      />
      <div className="flex flex-col">
        <h3 className="py-1 px-1.5 text-sm font-semibold line-clamp-2 align-middle">
          {item.headline}
        </h3>
      </div>
    </article>
  );
}
