import { eventTypeZod } from "@/types/eventType";

type PropsType = {
  events: eventTypeZod[];
  date: Date;
};

// 日付に対してイベントが登録されているかを確認
export const checkEvents = ({ events, date }: PropsType) => {
  return events?.filter(
    (event) => event.date.toLocaleDateString() === date.toLocaleDateString(),
  );
};
