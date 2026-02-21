import { getDate, getMonth, getYear } from "date-fns";

// 引数として受け取った二つの日付が同じかどうかを確認する
export const compareDates = (d1: Date, d2: Date): boolean => {
  return (
    getYear(d1) === getYear(d2) &&
    getMonth(d1) === getMonth(d2) &&
    getDate(d1) === getDate(d2)
  );
};
