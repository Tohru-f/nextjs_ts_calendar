import { format, getMonth, getYear } from "date-fns";

type PropsType = {
  today: Date;
  signal: string;
};

const currentMonth = format(new Date(), "yyyy/MM");

export const compareDesignatedMonths = ({ today, signal }: PropsType) => {
  if (format(today, "yyyy/MM") === currentMonth) {
    return "/";
  } else if (signal === "&gt;") {
    return `/month/${getYear(today)}/${getMonth(today) + 1}`;
  } else {
    return `/month/${getYear(today)}/${getMonth(today) + 1}`;
  }
};
