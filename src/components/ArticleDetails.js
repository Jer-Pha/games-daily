import React from "react";

export default function ArticleDetails({ item, status, onClose }) {
  return (
    <div className={`animate-drawer-${status}`}>
      <p>Site: {item.site}</p>
      <p>URL: {item.url}</p>
      <h3 className="font-bold">{item.headline}</h3>
      <p>Topic: {item.topic}</p>
      <p>{item.summary}</p>

      <button className="" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
