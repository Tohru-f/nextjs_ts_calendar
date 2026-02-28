import { today } from "@/constants/calendar";
import { format, getMonth, getYear } from "date-fns";

export const weekOfTodayURL = () => {
  return `/week/${getYear(today)}/${getMonth(today) + 1}/${format(today, "dd")}`;
};
