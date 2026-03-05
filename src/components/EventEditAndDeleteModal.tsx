"use client";

import React, { useEffect } from "react";
import { eventSchema, eventTypeZod } from "@/types/eventType";
import { useError } from "@/contexts/ErrorContexts";
import EventForm from "./EventForm";
import { useEventModal } from "@/contexts/ModalContexts";
import { findCurrentEvent } from "@/utils/findCurrentEvent";

export const EventEditAndDeleteModal = () => {
  const { errorMessage, setErrorMessage } = useError();

  const {
    closeChangeModalHandler,
    setEvents,
    events,
    modalState,
    setModalState,
  } = useEventModal();

  // タイトルを更新入力された内容をupdatedTitleに反映させる
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (modalState?.mode === "edit") {
      setModalState({ ...modalState, editingTitle: e.target.value });
    }
  };

  // 変更入力されたタイトルの内容をイベントの配列・オブジェクトに反映させる
  const handleEditRegistration = () => {
    if (modalState?.mode === "edit") {
      const currentEvent: eventTypeZod = findCurrentEvent(
        modalState.id,
        events,
      );
      const result = eventSchema.safeParse({
        id: modalState.id,
        title: modalState.editingTitle,
        date: modalState.date,
      });
      if (!result.success) {
        setErrorMessage(result.error.format().title?._errors);
        return;
      }
      closeChangeModalHandler();
      const updatedEvents = events.map((event) => {
        if (event.id === currentEvent.id) {
          event.title = modalState.editingTitle;
          return event;
        } else {
          return event;
        }
      });
      setEvents(updatedEvents);
    }
  };

  // 選択したイベントを削除する。変更ボタンを押していたにので、表示されているタイトルは更新登録しない。
  const handleDelete = () => {
    if (modalState?.mode === "edit") {
      closeChangeModalHandler();
      setEvents([...events.filter((event) => event.id !== modalState.id)]);
    }
  };

  // Escapeキーを押した時にモーダルを閉じる
  useEffect(() => {
    const onKeyDownEsc = (event: KeyboardEvent) => {
      if (modalState?.mode === "edit" && event.key === "Escape") {
        event.preventDefault();
        closeChangeModalHandler();
      }
    };
    window.addEventListener("keydown", onKeyDownEsc);
    return () => window.removeEventListener("keydown", onKeyDownEsc);
  }, [modalState?.mode, closeChangeModalHandler]);

  if (modalState == null || modalState.mode !== "edit") return <></>;
  return (
    <>
      {modalState.mode === "edit" && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-100 opacity-80"
          onClick={closeChangeModalHandler}
        >
          <div
            className="pointer-events-auto z-1001 flex flex-col items-center justify-center rounded-2xl bg-black p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <EventForm
              title={modalState.editingTitle}
              handleChange={handleChange}
              date={modalState.date}
              errorMessage={errorMessage}
              close={closeChangeModalHandler}
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
