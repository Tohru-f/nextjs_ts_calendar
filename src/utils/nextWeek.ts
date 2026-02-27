import { addWeeks, format, getMonth, getYear } from "date-fns";

type PropsType = {
  standardDate: Date;
};

export const nextWeekURL = ({ standardDate }: PropsType) => {
  return `/week/${getYear(addWeeks(standardDate, 1))}/${getMonth(addWeeks(standardDate, 1)) + 1}/${format(addWeeks(standardDate, 1), "dd")}`;
};
