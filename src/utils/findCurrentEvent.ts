import { eventTypeZod } from "@/types/eventTypeZod";

export const findCurrentEvent = (id: number, events: eventTypeZod[]) => {
  return events.filter((event) => event.id === id)[0];
};
