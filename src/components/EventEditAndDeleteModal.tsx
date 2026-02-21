"use client";

import React, { useEffect } from "react";
import { eventSchema, eventTypeZod } from "@/types/eventType";
import { useError } from "@/contexts/ErrorContexts";
import { useModal } from "@/contexts/ModalContexts";

type PropsType = {
  show: boolean;
  close: (signal: boolean) => void;
  date: string;
  id: number;
  events: eventTypeZod[];
  setEvents: React.Dispatch<React.SetStateAction<eventTypeZod[]>>;
};

export const EventEditAndDeleteModal = ({
  show,
  close,
  date,
  id,
  events,
  setEvents,
}: PropsType) => {
  const { updatedTitle, setUpdatedTitle, currentEvent } = useModal();

  const { errorMessage, setErrorMessage } = useError();

  // モーダルを閉じる時の引数として利用。trueの場合は変更内容を保存しないので、モーダルを閉じる時にタイトルを元に戻す。
  let signal: boolean = true;

  // currentEventを監視して、中身が入った場合はその中身のtitleを使ってupdatedTitleを更新
  useEffect(() => {
    if (currentEvent) {
      setUpdatedTitle(currentEvent.title);
    }
  }, [currentEvent]);

  // タイトルを更新入力された内容をupdatedTitleに反映させる
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
  };

  // 変更入力されたタイトルの内容をイベントの配列・オブジェクトに反映させる
  const handleEditRegistration = () => {
    const result = eventSchema.safeParse({
      id,
      title: updatedTitle,
      date,
    });
    if (!result.success) {
      setErrorMessage(result.error.format().title?._errors);
      setUpdatedTitle(currentEvent.title);
      return;
    }
    close((signal = false));
    const updatedEvents = events.map((event) => {
      if (event.id === currentEvent.id) {
        event.title = updatedTitle;
        return event;
      } else {
        return event;
      }
    });
    setEvents(updatedEvents);
  };

  // 選択したイベントを削除する
  const handleDelete = () => {
    close((signal = false));
    setEvents([...events.filter((event) => event.id !== id)]);
  };

  // Escapeキーを押した時にモーダルを閉じる
  useEffect(() => {
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (show && event.key === "Escape") {
        event.preventDefault();
        close(signal);
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
              <span className="text-white" onClick={() => close(signal)}>
                ✖︎
              </span>
            </div>
            <span className="text-white">イベント名</span>
            <input
              className="rounded-md border border-white text-white"
              type="text"
              placeholder="イベント"
              name="title"
              value={updatedTitle}
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
            <div className="flex">
              <button
                className="border-color-white m-5 rounded-2xl border px-3 py-1 text-white"
                onClick={handleEditRegistration}
              >
                変更
              </button>
              <button
                className="border-color-white m-5 rounded-2xl border px-3 py-1 text-white"
                onClick={handleDelete}
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventEditAndDeleteModal;
