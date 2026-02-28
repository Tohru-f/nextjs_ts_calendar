import { getDate, getMonth, getYear } from "date-fns";

// 引数として受け取った二つの日付が同じかどうかを確認する
export const compareDates = (d1: Date, d2: Date, month: string): string => {
  const isSameDay: boolean =
    getYear(d1) === getYear(d2) &&
    getMonth(d1) === getMonth(d2) &&
    getDate(d1) === getDate(d2);

  if (isSameDay) {
    return "rounded-full border border-solid border-orange-500 bg-orange-500 px-2 py-2";
  } else if (getMonth(d2) + 1 !== parseInt(month)) {
    return "text-gray-400";
  } else {
    return "";
  }
};
