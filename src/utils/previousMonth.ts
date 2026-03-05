import { addMonths, getMonth, getYear } from "date-fns";

type PropsType = {
  firstDate: Date;
};

// standardDateを使って取得方法に切り替える

// 前月へ遷移するためのURLを取得
export const previousMonthURL = ({ firstDate }: PropsType) => {
  return `/month/${getYear(addMonths(firstDate, -1))}/${getMonth(addMonths(firstDate, -1)) + 1}`;
};
