import React from "react";

export default function SkeletonArticle() {
  return (
    <div className="w-screen min-w-[100vw] tablet:min-w-[article-card] overflow-hidden border-y-2 border-x-2 border-transparent z-10 tablet:w-[article-card]">
      <div>
        <div className="w-full aspect-video object-cover tablet:max-h-[article-img] z-10 skeleton tablet:rounded-lg"></div>
      </div>
    </div>
  );
}
