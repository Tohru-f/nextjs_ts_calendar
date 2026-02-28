import { today } from "@/constants/calendar";
import { getMonth, getYear } from "date-fns";

// 今月に遷移するためのURLを取得
export const monthOfTodayURL = () => {
  return `/month/${getYear(today)}/${getMonth(today) + 1}`;
};
