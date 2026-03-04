"use client";

import { createContext, useContext, useState } from "react";
import { useError } from "./ErrorContexts";
import { eventTypeZod } from "@/types/eventType";

// 各コンポーネントに渡す値の型定義
export type ModalContextType = {
  events: eventTypeZod[];
  setEvents: React.Dispatch<React.SetStateAction<eventTypeZod[]>>;
  openModalHandler: (day: Date) => void;
  openChangeModalHandler: (day: Date, id: number, title: string) => void;
  closeModalHandler: () => void;
  closeChangeModalHandler: () => void;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
};

export type ModalState =
  | { mode: "create"; date: Date }
  | { mode: "edit"; date: Date; id: number; editingTitle: string }
  | null;

// 意味のあるデフォルトがない時はとりあえずnullで対応
const ModalContext = createContext<ModalContextType | null>(null);

export const EventModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [events, setEvents] = useState<eventTypeZod[]>([]);

  const [modalState, setModalState] = useState<ModalState>(null);

  // エラーメッセージの管理
  const { setErrorMessage } = useError();

  // イベント作成のモーダルを表示する
  const openModalHandler = (date: Date) => {
    setModalState({ mode: "create", date });
  };

  // イベント作成のモーダルを閉じる
  const closeModalHandler = () => {
    setModalState(null);
    setErrorMessage([]);
  };

  // イベント変更・削除のモーダルを表示する
  const openChangeModalHandler = (
    date: Date,
    id: number,
    editingTitle: string,
  ) => {
    setModalState({ mode: "edit", date, id, editingTitle });
    setErrorMessage([]);
  };

  // イベント変更・削除のモーダルを閉じる。変更ボタンを押していない場合はタイトルの内容を編集前に戻す
  const closeChangeModalHandler = () => {
    setModalState(null);
  };

  // childrenを囲うことでchildrenに対してvalueを受け渡す
  return (
    <ModalContext.Provider
      value={{
        events,
        setEvents,
        openModalHandler,
        openChangeModalHandler,
        closeModalHandler,
        closeChangeModalHandler,
        modalState,
        setModalState,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Providerの外でuseContext(ModalContext)を呼ぶとctxはnullになるので、エラーで潰しておく。
export const useEventModal = () => {
  const ctx = useContext(ModalContext);
  if (ctx === null)
    throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
