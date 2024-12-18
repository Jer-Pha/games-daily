import React, { useContext, useEffect } from "react";
import { ModalContext } from "../context/ModalContext";
import { InfoIcon, LogoIcon } from "../utils/Icons";

export default function Header() {
  const { openModal, closeModal, isModalOpen } = useContext(ModalContext);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (isModalOpen) {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen, closeModal]);

  const handleInfoBtnClick = () => {
    openModal(
      <>
        <h2 className="font-semibold text-xl">About Us</h2>
        <p className="text-sm text-justify">
          Staying up-to-date with the gaming world can be a challenge. With
          countless news outlets and articles flooding the internet, it's easy
          to miss the stories that matter most to you. That's where we come in.
        </p>
        <p className="text-sm text-justify">
          We provide a daily snapshot of the most popular, trending, and recent
          gaming news, gathering articles from{" "}
          <span className="font-heavitas">31</span> leading gaming news outlets
          and delivering them in an easy-to-browse format.
        </p>
        <p className="text-sm text-justify">
          With <span className="font-heavitas">Controller Chronicle</span>,
          finding news that fits your interests is a breeze. We identify and
          sort the topics of hundreds of articles, making it simple to discover
          the news you care about. Don't forget to try out the topic search in
          our Filter tab!
        </p>
        <p className="text-sm text-justify">
          We automatically check for new articles throughout the day, so you can
          be sure you're always seeing the most trending news, no matter when
          you visit. Start exploring the latest gaming news now!
        </p>
      </>
    );
  };

  return (
    <header className="flex justify-between bg-[var(--bg-color)]">
      <div className="max-w-8 flex-1"></div>
      <div className="flex items-center">
        <div className="p-1 mr-1 h-10 w-10 sm-phone:hidden tablet:hidden desktop:block">
          <LogoIcon />
        </div>
        <h1 className="font-heavitas text-xl tablet:text-lg cursor-default line-clamp-1">
          Controller Chronicle
        </h1>
      </div>
      <button
        className=""
        onClick={handleInfoBtnClick}
        type="button"
        aria-label="About us"
        title="About Us"
      >
        <div className="p-0.5 m-1 h-8 w-8" type="button">
          <InfoIcon />
        </div>
      </button>
    </header>
  );
}
