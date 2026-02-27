import { eventTypeZod } from "@/types/eventType";
import { getDate, getYear } from "date-fns";

type PropsType = {
  events: eventTypeZod[];
  day: Date;
  selectedDay: Date; // 年の取得に使用
  currentMonth: number;
};

// 日付に対してイベントが登録されているかを確認
export const checkEvents = ({
  events,
  day,
  selectedDay,
  currentMonth,
}: PropsType) => {
  return events?.filter(
    (event) =>
      event.date.toLocaleDateString() ===
      new Date(
        getYear(selectedDay),
        currentMonth,
        getDate(day),
      ).toLocaleDateString(),
  );
};
