import React from "react";
import SkeletonArticle from "./SkeletonArticle";
import { LogoIcon, ModeToggleIcon } from "../utils/Icons";

export default function SkeletonView() {
  return (
    <>
      <div className="flex flex-col desktop:items-center w-full overflow-y-auto gutter pr-1 tablet:pr-0">
        <div className="flex bg-transparent desktop:w-[content-d] max-w-screen-desktop border-r-[1px] border-transparent tab-corners">
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
          <div className="flex-1 border-b-[1px] border-[var(--text-color)] bg-[var(--bg-color)]">
            <div className="hidden tablet:flex justify-center items-center h-full">
              <div
                className="hidden desktop:block p-0.5 h-10 w-10"
                type="button"
              >
                <LogoIcon />
              </div>
              <h1 className="font-heavitas text-lg desktop:text-2xl px-2">
                Controller Chronicle
              </h1>
            </div>
          </div>
          <div className="border-[1px] border-[var(--text-color)] bg-[var(--accent-color)] rounded-t-lg -mr-px">
            <div
              className="p-2 tablet:p-1.5 m-2 tablet:m-1 h-10 w-10 tablet:h-8 tablet:w-8"
              type="button"
            >
              <ModeToggleIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full desktop:items-center overflow-x-hidden overflow-y-auto gutter max-h-[calc(100vh-59px)] tablet:max-h-[calc(100vh-43px)] pr-1 tablet:pr-0">
        <div className="content-view tablet:w-[content-t] desktop:w-[content-d] max-w-screen-desktop border-content">
          {Array.from({ length: 11 }).map((_, index) => (
            <section
              key={index}
              className={`tablet:px-4 pb-4 relative ${
                index % 2 !== 0
                  ? "bg-[var(--surface-color)]"
                  : "bg-[var(--primary-color)]"
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
    </>
  );
}
