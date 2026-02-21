"use client";

import { createContext, useContext, useState } from "react";
import { useError } from "./ErrorContexts";
import { eventTypeZod } from "@/types/eventType";
import { findCurrentEvent } from "@/utils/findCurrentEvent";

// 各コンポーネントに渡す値の型定義
export type ModalContextType = {
  events: eventTypeZod[];
  setEvents: React.Dispatch<React.SetStateAction<eventTypeZod[]>>;
  showEventModal: boolean;
  showEventChangeModal: boolean;
  designatedDate: string;
  designatedId: number;
  openModalHandler: (day: string) => void;
  openChangeModalHandler: (day: string, id: number) => void;
  closeModalHandler: () => void;
  closeChangeModalHandler: (signal: boolean) => void;
  updatedTitle: string;
  setUpdatedTitle: React.Dispatch<React.SetStateAction<string>>;
  currentEvent: eventTypeZod;
};

// 意味のあるデフォルトがない時はとりあえずnullで対応
const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<eventTypeZod[]>([]);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showEventChangeModal, setShowEventChangeModal] =
    useState<boolean>(false);
  const [designatedDate, setDesignatedDate] = useState<string>("");
  const [designatedId, setDesignatedId] = useState<number>(0);

  const currentEvent: eventTypeZod = findCurrentEvent(designatedId, events);

  const [updatedTitle, setUpdatedTitle] = useState<string>(
    currentEvent ? currentEvent.title : "",
  );

  // エラーメッセージの管理
  const { errorMessage, setErrorMessage } = useError();

  // イベント作成のモーダルを表示する
  const openModalHandler = (day: string) => {
    setShowEventModal(true);
    setDesignatedDate(day);
  };

  // イベント作成のモーダルを閉じる
  const closeModalHandler = () => {
    setShowEventModal(false);
    setErrorMessage([]);
  };

  // イベント変更・削除のモーダルを表示する
  const openChangeModalHandler = (day: string, id: number) => {
    setShowEventChangeModal(true);
    setDesignatedDate(day);
    setDesignatedId(id);
    setErrorMessage([]);
  };

  // イベント変更・削除のモーダルを閉じる。変更ボタンを押していない場合はタイトルの内容を編集前に戻す
  const closeChangeModalHandler = (signal: boolean) => {
    setShowEventChangeModal(false);
    if (signal) {
      setUpdatedTitle(currentEvent.title);
    }
  };

  // childrenを囲うことでchildrenに対してvalueを受け渡す
  return (
    <ModalContext.Provider
      value={{
        events,
        setEvents,
        showEventModal,
        showEventChangeModal,
        designatedDate,
        designatedId,
        openModalHandler,
        openChangeModalHandler,
        closeModalHandler,
        closeChangeModalHandler,
        updatedTitle,
        setUpdatedTitle,
        currentEvent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Providerの外でuseContext(ModalContext)を呼ぶとctxはnullになるので、エラーで潰しておく。
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (ctx === null)
    throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
