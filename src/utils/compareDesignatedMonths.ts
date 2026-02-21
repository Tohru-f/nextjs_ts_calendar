import { format, getMonth, getYear } from "date-fns";

type PropsType = {
  today: Date;
  signal: string;
};

const currentMonth = format(new Date(), "yyyy/MM");

// 移動月が当月かどうかで遷移先のURLを決める
export const compareDesignatedMonths = ({ today, signal }: PropsType) => {
  if (format(today, "yyyy/MM") === currentMonth) {
    return "/";
  } else {
    return `/month/${getYear(today)}/${getMonth(today) + 1}`;
  }
};
