"use client";

import { useError } from "@/contexts/ErrorContexts";
import { eventSchema } from "@/types/eventType";
import React, { useEffect } from "react";
import EventForm from "./EventForm";
import { useModal } from "@/contexts/ModalContexts";

export const EventCreateModal = () => {
  let title!: string;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    title = e.target.value;
  };

  const {
    showEventModal,
    closeModalHandler,
    designatedDate,
    setEvents,
    events,
  } = useModal();

  const { errorMessage, setErrorMessage } = useError();

  const handleRegistration = () => {
    if (title == undefined) {
      title = "";
    }
    const result = eventSchema.safeParse({
      id: events.length + 1,
      title,
      date: designatedDate,
    });
    if (!result.success) {
      console.log(result.error.format().title?._errors);
      setErrorMessage(result.error.format().title?._errors);
      return;
    }
    closeModalHandler();
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title,
        date: designatedDate,
      },
    ]);
    title = "";
  };

  // Escapeキーを押した時にモーダルを閉じる
  useEffect(() => {
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (showEventModal && event.key === "Escape") {
        event.preventDefault();
        closeModalHandler();
      }
    };
    window.addEventListener("keydown", onKeyDownEsc);
    return () => window.removeEventListener("keydown", onKeyDownEsc);
  }, [showEventModal, closeModalHandler]);

  return (
    <>
      {showEventModal && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-100 opacity-80"
          onClick={closeModalHandler}
        >
          <div
            className="pointer-events-auto z-1001 flex flex-col items-center justify-center rounded-2xl bg-black p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <EventForm
              title={title}
              handleChange={handleChange}
              date={designatedDate}
              errorMessage={errorMessage}
              close={closeModalHandler}
            />
            <button
              className="border-color-white m-5 rounded-2xl border px-3 py-1 text-white"
              onClick={handleRegistration}
            >
              登録
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCreateModal;
