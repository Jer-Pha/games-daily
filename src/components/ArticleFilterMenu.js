import React, { useState } from "react";
import { sanitizeId } from "../utils/utils";
import Fuse from "fuse.js";
import { CloseIcon } from "./Icons";

export default function ArticleFilterMenu({
  outletNames,
  topicData,
  selectedOutlets,
  setSelectedOutlets,
  selectedTopics,
  setSelectedTopics,
}) {
  const [activeTab, setActiveTab] = useState("topic");
  const [searchQuery, setSearchQuery] = useState("");

  // Add initials of topics to search parameters
  const topicDataWithInitials = topicData.map((originalTopic) => {
    const initials = originalTopic
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
    return {
      topic: originalTopic,
      keywords: [originalTopic, initials],
    };
  });

  // User can filter topics by searching
  const filterTopics = (topics, query) => {
    if (query === "") {
      return topics;
    }
    const fuse = new Fuse(topics, {
      keys: ["keywords"],
      threshold: 0.6,
      distance: 60,
      location: 40,
    });
    const results = fuse.search(query);
    return results.map((result) => result.item);
  };

  // Change filter tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Update selectedOutlets on checkbox change
  const handleOutletChange = (outlet) => {
    setSelectedOutlets((prevSelectedOutlets) => {
      if (prevSelectedOutlets.includes(outlet)) {
        return prevSelectedOutlets.filter((item) => item !== outlet);
      } else {
        return [...prevSelectedOutlets, outlet];
      }
    });
  };

  // Update selectedTopics on checkbox change
  const handleTopicChange = (topic) => {
    setSelectedTopics((prevSelectedTopics) => {
      if (prevSelectedTopics.includes(topic)) {
        return prevSelectedTopics.filter((item) => item !== topic);
      } else {
        return [...prevSelectedTopics, topic];
      }
    });
  };

  // Clear all checkboxes for current tab
  const handleClearFilter = () => {
    if (activeTab === "outlet") {
      setSelectedOutlets([]);
    } else if (activeTab === "topic") {
      setSearchQuery("");
      setSelectedTopics([]);
    }
  };

  // Select all checkboxes for current tab
  const handleSelectAllFilter = () => {
    if (activeTab === "outlet") {
      setSelectedOutlets(outletNames.map((outlet) => outlet.slug));
    } else if (activeTab === "topic") {
      setSearchQuery("");
      setSelectedTopics(
        topicDataWithInitials.map((topicObject) => topicObject.topic)
      );
    }
  };

  return (
    <div className="w-60 desktop:w-80 fixed">
      <div id="filter-tabs" className="flex">
        <button
          type="button"
          className={`w-1/2 py-2 text-sm bg-[var(--surface-color)] border-[var(--text-color)] rounded-t-md ${
            activeTab === "topic"
              ? "border-b-0 border-[1px]"
              : "border-b-[1px] inner-top-left"
          }`}
          onClick={() => handleTabClick("topic")}
        >
          Topics
        </button>
        <button
          type="button"
          className={`w-1/2 py-2 text-sm bg-[var(--primary-color)] border-[var(--text-color)] rounded-t-md ${
            activeTab === "outlet"
              ? "border-b-0 border-[1px]"
              : "border-b-[1px] inner-top-right"
          }`}
          onClick={() => handleTabClick("outlet")}
        >
          Outlets
        </button>
      </div>
      <div
        id="filter-options"
        className={`px-4 py-2 border-t-0 border-[1px] border-[var(--text-color)] max-h-[calc(100vh-166px)] overflow-y-auto overflow-c-hidden text-left ${
          activeTab === "outlet"
            ? "bg-[var(--primary-color)]"
            : "bg-[var(--surface-color)]"
        }`}
      >
        {activeTab === "outlet" && (
          <div className="flex flex-col">
            {outletNames.map((outlet) => (
              <label
                htmlFor={`checkbox-${outlet.slug}`}
                key={outlet.slug}
                className="py-0.5 cursor-pointer relative"
              >
                <input
                  id={`checkbox-${outlet.slug}`}
                  type="checkbox"
                  value={outlet.slug}
                  name="filter-by-outlet"
                  className="absolute top-1/2 transform -translate-y-1/2"
                  checked={selectedOutlets.includes(outlet.slug)}
                  onChange={() => handleOutletChange(outlet.slug)}
                />
                <span className="ml-6 inline-block">{outlet.name}</span>
              </label>
            ))}
          </div>
        )}
        {activeTab === "topic" && (
          <div className="flex flex-col">
            <div className="relative my-2">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[var(--primary-color)] rounded-lg px-4 py-1 w-full"
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <CloseIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
            {filterTopics(topicDataWithInitials, searchQuery).map(
              (topicObject) => {
                const topic = topicObject.topic;
                return (
                  <label
                    htmlFor={`checkbox-${sanitizeId(topic)}`}
                    key={topic}
                    className="py-0.5 cursor-pointer relative"
                  >
                    <input
                      id={`checkbox-${sanitizeId(topic)}`}
                      type="checkbox"
                      value={topic}
                      name="filter-by-topic"
                      className="absolute top-1/2 transform -translate-y-1/2"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => handleTopicChange(topic)}
                    />
                    <span className="ml-6 inline-block">{topic}</span>
                  </label>
                );
              }
            )}
          </div>
        )}
      </div>
      <div class="flex justify-evenly mt-4">
        <button
          id="filter-clear"
          type="reset"
          className="px-4 py-2 bg-[var(--text-color)] text-[var(--primary-color)] rounded-lg"
          onClick={handleClearFilter}
        >
          Clear all
        </button>
        <button
          id="filter-all"
          type="button"
          className="px-4 py-2 bg-[var(--accent-color)] rounded-lg"
          onClick={handleSelectAllFilter}
        >
          Select all
        </button>
      </div>
    </div>
  );
}
