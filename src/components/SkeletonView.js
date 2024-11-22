import React from "react";
import SkeletonArticle from "./SkeletonArticle";
import { ModeToggleIcon } from "./Icons";

export default function SkeletonView({ sliceSize }) {
  return (
    <>
      <div className="tablet:w-[content-t] desktop:w-[content-d] max-w-[content-t] desktop:mx-auto">
        <div className="flex bg-transparent">
          <button
            className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] rounded-t-lg font-semibold border-b-0 border-[1px] border-[var(--text-color)]`}
            disabled={true}
          >
            Topics
          </button>
          <button
            className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--surface-color)] rounded-t-lg inner-top-right border-b-[1px] border-[var(--text-color)]`}
            disabled={true}
          >
            Outlets
          </button>
          <button
            className={`px-6 py-3 tablet:py-2 text-center uppercase text-sm bg-[var(--primary-color)] rounded-t-lg inner-top-right border-b-[1px] border-[var(--text-color)]`}
            disabled={true}
          >
            Filter
          </button>
          <div className="flex-1 border-b-[1px] border-[var(--text-color)]"></div>
          <div className="border-b-[1px] border-[var(--text-color)]">
            <div className="p-2 tablet:p-1.5 m-2 tablet:m-1 bg-[var(--accent-color)] rounded-full aspect-square h-10 w-10 tablet:h-8 tablet:w-8">
              <ModeToggleIcon />
            </div>
          </div>
        </div>
        <div className="flex overflow-y-scroll ax-h-[calc(100vh-58px)] tablet:max-h-[calc(100vh-42px)] border-t-0 border-[1px] border-[var(--text-color)] bg-[var(--primary-color)]">
          <div className="bg-[var(--primary-color)] overflow-hidden ">
            {Array.from({ length: sliceSize }).map((_, index) => (
              <section
                key={index}
                className={`tablet:px-4 pb-4 relative ${
                  index % 2 !== 0 ? "bg-[var(--surface-color)]" : ""
                }`}
              >
                <h2 className="text-xl tablet:text-2xl font-semibold text-left py-2 pl-4 tablet:px-0">
                  &nbsp;
                </h2>
                <div className="overflow-x-auto overflow-y-hidden scrollbar-hide articles-container snap-x snap-mandatory">
                  <div className="flex gap-0 tablet:gap-1 w-max article-row">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonArticle key={index} />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
