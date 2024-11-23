import React, { useRef, useEffect, useState, useContext } from "react";
import { ArticleContext } from "../context/ArticleContext";
import { CloseIcon, QuestionMarkIcon } from "../utils/Icons";

export default function ArticleDetails({ article, status }) {
  const { setSelectedArticle } = useContext(ArticleContext);
  const detailsRef = useRef(null);
  const buttonRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (status === "open" && detailsRef.current) {
      setTimeout(() => {
        buttonRef.current?.classList.add("!opacity-100");
        detailsRef.current?.classList.add("border-t-2");
        detailsRef.current?.classList.add("!h-fit");
      }, 150);
    } else if (status === "close") {
      buttonRef.current?.classList.remove("!opacity-100");
      detailsRef.current?.classList.remove("border-t-2");
    }
  }, [status]);

  const handleCloseBtnClick = () => {
    setSelectedArticle(null);
  };

  const handleQuestionMarkClick = () => {
    setShowPopup(!showPopup);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div
      id="article-details"
      ref={detailsRef}
      className={`fixed
        flex
        flex-col
        overflow-y-auto
        overflow-x-hidden
        w-[calc(100%-4px)]
        tablet:w-56
        desktop:w-72
        max-h-[calc(100vh-32px)]
        left-0
        tablet:left-[auto]
        desktop:left-[min(calc(100vw-320px),calc(50vw+700px))]
        right-0
        desktop:right-[auto]
        tablet:top-1/2
        bottom-0
        tablet:bottom-[auto]
        tablet:transform
        tablet:-translate-y-1/2
        p-2
        tablet:p-4
        tablet:m-4
        border-[1px]
        border-[var(--text-color)]
        tablet:rounded-lg
        bg-[var(--accent-color)]
        text-sm
        z-50
        `}
    >
      <button
        onClick={handleCloseBtnClick}
        className="absolute right-1 top-1 h-6 w-6"
        type="button"
      >
        <CloseIcon />
      </button>
      <h4 className="font-bold text-md tablet:text-lg desktop:text-xl mb-0 m-4">
        {article.headline}
      </h4>
      <a
        href={article.url}
        className="underline my-2 tablet:my-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read Article
      </a>
      <div className="bg-[var(--primary-color)] p-4 rounded-lg">
        <div className="flex gap-2">
          <p className="text-left font-semibold">Summary</p>
          <button type="button" className="h-5 w-5">
            <QuestionMarkIcon onClick={handleQuestionMarkClick} />
          </button>
        </div>
        {showPopup && (
          <div className="popup top-6 absolute bg-[var(--accent-color)] p-2 text-sm mr-4 rounded-lg text-justify flex flex-col gap-1">
            <p className="font-semibold">Summary</p>
            <p className="text-xs">
              The summary is generated by Google's Gemini AI. It is meant to be
              a brief idea of what the article is about without taking away from
              the original author.
            </p>
            <p className="italic text-xs">
              Note: AI can be unpredictable. The details of the summary may not
              be accurate. Please see the full article for accurate information.
            </p>
            <button
              onClick={handlePopupClose}
              className="absolute right-1 top-1 h-6 w-6"
              type="button"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <p className="text-justify text-sm desktop:text-base">
          {article.summary}
        </p>
      </div>
    </div>
  );
}
