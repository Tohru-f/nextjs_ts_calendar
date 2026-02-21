import { eventTypeZod } from "@/types/eventType";
import { getYear } from "date-fns";

type PropsType = {
  events: eventTypeZod[];
  day: string;
  selectedDay: Date;
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
      event.date ===
      new Date(
        getYear(selectedDay),
        currentMonth,
        parseInt(day),
      ).toLocaleDateString(),
  );
};
