import React, { useRef, useEffect } from "react";
import { ArrowDropUpIcon } from "./Icons";

export default function ArticleDetails({ item, status, onClose }) {
  const detailsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (status === "open" && detailsRef.current) {
      setTimeout(() => {
        buttonRef.current?.classList.add("!opacity-100");
        detailsRef.current?.classList.toggle("border-t-2");
        detailsRef.current?.classList.add("!h-fit");
      }, 150);
    } else if (status === "close") {
      buttonRef.current?.classList.remove("!opacity-100");
      detailsRef.current?.classList.toggle("border-t-2");
    }
  }, [status]);

  return (
    <div
      id="article-details"
      ref={detailsRef}
      className={`pb-4 bg-[var(--bg-color)] animate-drawer-${status} border-x-2 border-[var(--text-color)] flex`}
    >
      <div className="flex flex-col self-center tablet:flex-row tablet:justify-evenly p-4 h-full">
        <div className="tablet:w-2/5">
          <p>Site: {item.site}</p>
          <p>URL: {item.url}</p>
          <h3 className="font-bold">{item.headline}</h3>
          <p>Topic: {item.topic}</p>
        </div>
        <div className="tablet:w-3/5 bg-[var(--surface-color)] text-center ">
          <p>{item.summary}</p>
        </div>
      </div>
      <button
        className={`h-4 absolute bottom-0 left-0 right-0 bg-[var(--text-color)] fill-[var(--bg-color)] flex justify-center items-center opacity-0`}
        onClick={onClose}
        ref={buttonRef}
        type="button"
      >
        <ArrowDropUpIcon />
      </button>
    </div>
  );
}
