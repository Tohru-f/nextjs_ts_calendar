"use client";

import { createContext, useContext, useState } from "react";

// 各コンポーネントに渡す値の型定義
export type ErrorContextType = {
  errorMessage: string[] | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

// 意味のあるデフォルトがない時はとりあえずnullで対応
const ErrorContext = createContext<ErrorContextType | null>(null);

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState<string[] | undefined>(
    undefined,
  );

  // childrenを囲うことでchildrenに対してvalueを受け渡す
  return (
    <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

// Providerの外でuseContext(ModalContext)を呼ぶとctxはnullになるので、エラーで潰しておく。
export const useError = () => {
  const ctx = useContext(ErrorContext);
  if (ctx === null)
    throw new Error("useError must be used within DisplayProvider");
  return ctx;
};
