"use client";

import { useError } from "@/contexts/ErrorContexts";
import { eventSchema } from "@/types/eventType";
import React, { useEffect, useState } from "react";
import EventForm from "./EventForm";
import { useEventModal } from "@/contexts/ModalContexts";

export const EventCreateModal = () => {
  const [title, setTitle] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const { closeModalHandler, setEvents, events, modalState } = useEventModal();

  const { errorMessage, setErrorMessage } = useError();

  const handleRegistration = () => {
    if (modalState?.mode === "create") {
      const result = eventSchema.safeParse({
        id: events.length + 1,
        title,
        date: modalState.date,
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
          date: modalState.date,
        },
      ]);
      setTitle("");
    }
  };

  // Escapeキーを押した時にモーダルを閉じる
  useEffect(() => {
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (modalState?.mode === "create" && event.key === "Escape") {
        event.preventDefault();
        closeModalHandler();
      }
    };
    window.addEventListener("keydown", onKeyDownEsc);
    return () => window.removeEventListener("keydown", onKeyDownEsc);
  }, [modalState?.mode, closeModalHandler]);

  if (modalState == null || modalState.mode !== "create") return <></>;
  return (
    <>
      {modalState.mode === "create" && (
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
              date={modalState.date}
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
