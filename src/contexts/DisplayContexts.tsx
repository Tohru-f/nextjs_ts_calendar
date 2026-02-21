"use client";

import { options } from "@/constants/options";
import { createContext, useContext, useState } from "react";

// 各コンポーネントに渡す値の型定義
export type DisplayContextType = {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

// 意味のあるデフォルトがない時はとりあえずnullで対応
const DisplayContext = createContext<DisplayContextType | null>(null);

export const DisplayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // 表示方式(Month, Week)の切り替えを管理
  const [selectedOption, setSelectedOption] = useState<string>(
    options[0].value,
  );

  // childrenを囲うことでchildrenに対してvalueを受け渡す
  return (
    <DisplayContext.Provider value={{ selectedOption, setSelectedOption }}>
      {children}
    </DisplayContext.Provider>
  );
};

// Providerの外でuseContext(ModalContext)を呼ぶとctxはnullになるので、エラーで潰しておく。
export const useDisplay = () => {
  const ctx = useContext(DisplayContext);
  if (ctx === null)
    throw new Error("useDisplay must be used within DisplayProvider");
  return ctx;
};
