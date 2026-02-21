import { eventTypeZod } from "@/types/eventType";

// idを使ってイベントオブジェクトから該当のイベントを取り出す
export const findCurrentEvent = (id: number, events: eventTypeZod[]) => {
  return events.filter((event) => event.id === id)[0];
};
