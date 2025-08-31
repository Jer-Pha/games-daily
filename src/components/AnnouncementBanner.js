import { useState, useEffect } from "react";

import { CloseIcon } from "../utils/Icons";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-down after mount
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transform transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white dark:bg-blue-500">
        <span className="text-sm sm:text-base">
          Now live: Explore{" "}
          <a
            href="https://upcoming.controllerchronicle.com"
            className="underline font-medium hover:text-gray-200 dark:hover:text-gray-100"
          >
            Upcoming Games
          </a>
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-[calc(50%-12px)] h-6 w-6"
          type="button"
          aria-label="Close banner"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
