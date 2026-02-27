import React from "react";
import Link from "next/link";
import { weekdayList } from "@/constants/weekdayList";
import {
  eachDayOfInterval,
  format,
  getDay,
  getYear,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";
import { monthList } from "@/constants/monthList";
import DataAndEventsComponent from "@/components/DateAndEventsComponent";
import { nextMonthURL } from "@/utils/nextMonth";
import { previousMonthURL } from "@/utils/previousMonth";
import { monthOfTodayURL } from "@/utils/monthOfToday";

type PropsType = {
  params: Promise<{ year: string; month: string }>;
};

const MonthDisplayPage = ({ params }: PropsType) => {
  // クライアントコンポーネントを呼び出す時にCSSを切り替えるための変数
  const isMonth: boolean = true;

  // パラメーターから年と月を取得する
  const { year, month } = React.use(params);

  // 当月の基準となる初日の日付
  const standardDate = new Date(`${year}/${month}/1`);

  // 当月の初日を取得する
  const firstDate: string = format(startOfMonth(standardDate), "dd");
  // 当月の最終日を取得する
  const lastDate: string = format(lastDayOfMonth(standardDate), "dd");
  // 当月の日付全てを配列として取得する。数値ではなく文字列指定で実装すればコードを短くできる
  let currentDays: Date[] = eachDayOfInterval({
    start: new Date(`${year}/${month}/${firstDate}`),
    end: new Date(`${year}/${month}/${lastDate}`),
  });

  // 当月の初日に当てられた曜日の番号を取得する
  const firstDay: number = getDay(startOfMonth(standardDate));

  // 月から英名の月を選択
  const month_english: string = monthList[parseInt(month) - 1];

  // ヘッダーに表示する月(英名)と年を作成
  const current_month_english: string =
    month_english + " " + getYear(standardDate);

  return (
    <div className="flex h-screen flex-col bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="flex h-10 w-full gap-4 bg-white px-10 py-2">
        <div className="flex items-center gap-4">
          <span className="text-2xl">&#128467;&#65039;</span>
          <span className="text-2xl">Calendar</span>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex items-center justify-around gap-4">
            <Link
              href={monthOfTodayURL()}
              className="rounded-4xl border px-4 py-1"
            >
              Today
            </Link>
            <Link
              suppressHydrationWarning
              href={previousMonthURL({ standardDate })}
            >
              &lt;
            </Link>
            <Link
              suppressHydrationWarning
              href={nextMonthURL({ standardDate })}
            >
              &gt;
            </Link>
            <span className="text-xl">{current_month_english}</span>
          </div>
          <div className="flex items-center">
            <Link
              href={`/week/${year}/${month}/1`}
              className="rounded-4xl border px-4 py-1"
            >
              Week
            </Link>
          </div>
        </div>
      </header>
      <div className="m-4 grid flex-1 grid-cols-7 overflow-hidden rounded-2xl bg-gray-50/80 shadow-xl">
        {weekdayList.map((date) => (
          <div key={date} className="text-center">
            <span>{date}</span>
          </div>
        ))}
        {currentDays.map((day) => (
          <DataAndEventsComponent
            day={day}
            firstDay={firstDay}
            year={year}
            month={month}
            today={standardDate}
            isMonth={isMonth}
            key={day.toString()}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthDisplayPage;
