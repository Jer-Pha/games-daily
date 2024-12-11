import React, { useState } from "react";
import { sanitizeId } from "../utils/utils";
import Fuse from "fuse.js";
import { CloseIcon, FilterOffIcon, FilterOnIcon } from "../utils/Icons";

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
  const [filterMenuIsOpen, setFilterMenuIsOpen] = useState(false);

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

  // Toggle filter menu visibility
  const handleFilterMenuToggle = (status) => {
    setFilterMenuIsOpen(status);
  };

  return (
    <div
      className={`w-full desktop:w-auto h-full fixed desktop:static left-0 top-0 z-40 ${
        filterMenuIsOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        id="filter-menu"
        className={`w-80 h-full absolute top-0 left-0 z-50 bg-[var(--accent-color)] desktop:bg-[var(--primary-color)] border-r-[var(--text-color)] border-transparent border-[1px] border-b-[1px] p-4 pointer-events-auto transform transition-transform desktop:transform-none ${
          filterMenuIsOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label={filterMenuIsOpen ? "Close filter" : "Open filter"}
          className="absolute desktop:static desktop:hidden top-1/2 -right-0 transform translate-x-full -translate-y-1/2 p-1 border-[var(--text-color)] border-[1px] border-l-[var(--accent-color)] border-l-2 rounded-r-lg bg-[var(--accent-color)] "
          onClick={() => handleFilterMenuToggle(!filterMenuIsOpen)}
        >
          <div className="h-8 w-8">
            {filterMenuIsOpen ? <FilterOffIcon /> : <FilterOnIcon />}
          </div>
        </button>
        <div id="filter-tabs" className="flex">
          <button
            type="button"
            aria-label="Filter by topic"
            className={`w-1/2 py-2 text-sm bg-[var(--bg-color)] border-[var(--text-color)] rounded-t-md ${
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
            aria-label="Filter by outlet"
            className={`w-1/2 py-2 text-sm bg-[var(--surface-color)] border-[var(--text-color)] rounded-t-md ${
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
          className={`px-4 py-2 border-t-0 border-[1px] border-[var(--text-color)] max-h-[calc(100vh-184px)] tablet:max-h-[calc(100vh-170px)] overflow-y-auto overflow-x-hidden text-left ${
            activeTab === "outlet"
              ? "bg-[var(--surface-color)]"
              : "bg-[var(--bg-color)]"
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
                  className="bg-[var(--surface-color)] rounded-lg px-4 py-1 w-full"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
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
        <div className="flex justify-evenly mt-4">
          <button
            id="filter-clear"
            type="reset"
            aria-label={
              activeTab === "topic" ? "Clear all topics" : "Clear all outlets"
            }
            className="px-4 py-2 bg-[var(--text-color)] text-[var(--bg-color)] rounded-lg"
            onClick={handleClearFilter}
          >
            Clear all
          </button>
          <button
            id="filter-all"
            type="button"
            aria-label={
              activeTab === "topic" ? "Select all topics" : "Select all outlets"
            }
            className="px-4 py-2 bg-[var(--primary-color)] desktop:bg-[var(--accent-color)] rounded-lg"
            onClick={handleSelectAllFilter}
          >
            Select all
          </button>
        </div>
      </div>
      <div
        id="filter-overlay"
        className={`w-full h-full bg-black bg-opacity-50 absolute desktop:static top-0 left-0 z-40 ${
          filterMenuIsOpen
            ? "static desktop:hidden"
            : "hidden pointer-events-none"
        }`}
        onClick={() => handleFilterMenuToggle(false)}
      ></div>
    </div>
  );
}
