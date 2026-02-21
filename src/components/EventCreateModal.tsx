"use client";

import { useError } from "@/contexts/ErrorContexts";
import { eventSchema, eventTypeZod } from "@/types/eventType";
import React, { useEffect } from "react";

type PropsType = {
  show: boolean;
  close: () => void;
  date: string;
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
    <>
      {show && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-100 opacity-80">
          <div className="z-1001 flex flex-col items-center justify-center rounded-2xl bg-black p-4">
            <div className="ml-auto flex justify-end">
              <span className="text-white" onClick={close}>
                ✖︎
              </span>
            </div>
            <span className="text-white">イベント名</span>
            <input
              className="rounded-md border border-white text-white"
              type="text"
              placeholder="イベント"
              name="title"
              value={title}
              onChange={handleChange}
              autoFocus
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <span className="text-white">日付</span>
            <input
              className="rounded-md border border-white text-white"
              type="text"
              placeholder="年/月/日"
              name="date"
              value={date}
              readOnly
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
