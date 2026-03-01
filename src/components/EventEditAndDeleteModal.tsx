"use client";

import React, { useEffect } from "react";
import { eventSchema } from "@/types/eventType";
import { useError } from "@/contexts/ErrorContexts";
import { useModal } from "@/contexts/ModalContexts";
import EventForm from "./EventForm";

export const EventEditAndDeleteModal = () => {
  const { errorMessage, setErrorMessage } = useError();

  const {
    updatedTitle,
    setUpdatedTitle,
    currentEvent,
    showEventChangeModal,
    closeChangeModalHandler,
    designatedDate,
    designatedId,
    setEvents,
    events,
  } = useModal();

  // タイトルを更新入力された内容をupdatedTitleに反映させる
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
  };

  // 変更入力されたタイトルの内容をイベントの配列・オブジェクトに反映させる
  const handleEditRegistration = () => {
    const result = eventSchema.safeParse({
      id: designatedId,
      title: updatedTitle,
      date: designatedDate,
    });
    if (!result.success) {
      setErrorMessage(result.error.format().title?._errors);
      setUpdatedTitle(currentEvent.title);
      return;
    }
    closeChangeModalHandler(false);
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

  // 選択したイベントを削除する。変更ボタンを押していたにので、表示されているタイトルは更新登録しない。
  const handleDelete = () => {
    closeChangeModalHandler(false);
    setEvents([...events.filter((event) => event.id !== designatedId)]);
  };

  // Escapeキーを押した時にモーダルを閉じる
  useEffect(() => {
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (showEventChangeModal && event.key === "Escape") {
        event.preventDefault();
        closeChangeModalHandler(true);
      }
    };
    window.addEventListener("keydown", onKeyDownEsc);
    return () => window.removeEventListener("keydown", onKeyDownEsc);
  }, [showEventChangeModal, closeChangeModalHandler]);

  return (
    <>
      {showEventChangeModal && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-100 opacity-80"
          onClick={() => closeChangeModalHandler(true)}
        >
          <div
            className="pointer-events-auto z-1001 flex flex-col items-center justify-center rounded-2xl bg-black p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <EventForm
              title={updatedTitle}
              handleChange={handleChange}
              date={designatedDate}
              errorMessage={errorMessage}
              close={() => closeChangeModalHandler(true)}
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
