import { addMonths, getMonth, getYear } from "date-fns";

type PropsType = {
  standardDate: Date;
};

// 次月へ遷移するためのURLを返却
export const nextMonthURL = ({ standardDate }: PropsType) => {
  return `/month/${getYear(addMonths(standardDate, 1))}/${getMonth(addMonths(standardDate, 1)) + 1}`;
};
