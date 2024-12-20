import React, { useContext } from "react";
import { ModalContext } from "../context/ModalContext";
import { CloseIcon } from "../utils/Icons";

export default function Modal() {
  const { isModalOpen, closeModal, modalContent } = useContext(ModalContext);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-60" onClick={closeModal} />
      <div className="bg-[var(--surface-color)] rounded-lg p-4 z-50 max-w-80 tablet:max-w-96 max-h-screen relative border-[var(--text-color)] overflow-y-auto border-2">
        <button
          onClick={closeModal}
          className="absolute right-2 top-2 h-6 w-6"
          type="button"
          aria-label="Close popup dialog"
        >
          <CloseIcon />
        </button>
        <div className="flex flex-col gap-2">{modalContent}</div>
      </div>
    </div>
  );
}
