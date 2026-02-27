"use client";

import { useError } from "@/contexts/ErrorContexts";
import { eventSchema, eventTypeZod } from "@/types/eventType";
import React, { useEffect } from "react";
import EventBodyComponent from "./EventBodyComponent";

type PropsType = {
  show: boolean;
  close: () => void;
  date: Date;
  events: eventTypeZod[];
  setEvents: React.Dispatch<React.SetStateAction<eventTypeZod[]>>;
};

export const EventCreateModal = ({
  show,
  close,
  date,
  events,
  setEvents,
}: PropsType) => {
  let title!: string;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    title = e.target.value;
  };

  const { errorMessage, setErrorMessage } = useError();

  const handleRegistration = () => {
    if (title == undefined) {
      title = "";
    }
    const result = eventSchema.safeParse({
      id: events.length + 1,
      title,
      date,
    });
    if (!result.success) {
      console.log(result.error.format().title?._errors);
      setErrorMessage(result.error.format().title?._errors);
      return;
    }
    close();
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title,
        date,
      },
    ]);
    title = "";
  };

  // Escapeキーを押した時にモーダルを閉じる
  useEffect(() => {
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (show && event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKeyDownEsc);
    return () => window.removeEventListener("keydown", onKeyDownEsc);
  }, [show, close]);

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-100 opacity-80"
      onClick={close}
    >
      <div
        className="pointer-events-auto z-1001 flex flex-col items-center justify-center rounded-2xl bg-black p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <EventBodyComponent
          title={title}
          handleChange={handleChange}
          date={date}
          errorMessage={errorMessage}
          close={close}
        />
        <button
          className="border-color-white m-5 rounded-2xl border px-3 py-1 text-white"
          onClick={handleRegistration}
        >
          登録
        </button>
      </div>
    </div>
  );
};

export default EventCreateModal;
