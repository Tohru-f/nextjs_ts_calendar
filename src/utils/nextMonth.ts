import { addMonths, getMonth, getYear } from "date-fns";

type PropsType = {
  firstDate: Date;
};

// 次月へ遷移するためのURLを返却
export const nextMonthURL = ({ firstDate }: PropsType) => {
  return `/month/${getYear(addMonths(firstDate, 1))}/${getMonth(addMonths(firstDate, 1)) + 1}`;
};
