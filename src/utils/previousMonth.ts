import { addMonths, getMonth, getYear } from "date-fns";

type PropsType = {
  standardDate: Date;
};

// standardDateを使って取得方法に切り替える

// 前月へ遷移するためのURLを取得
export const previousMonthURL = ({ standardDate }: PropsType) => {
  return `/month/${getYear(addMonths(standardDate, -1))}/${getMonth(addMonths(standardDate, -1)) + 1}`;
};
