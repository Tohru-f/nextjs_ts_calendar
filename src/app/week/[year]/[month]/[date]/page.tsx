import DataAndEventsComponent from "@/components/DateAndEventsComponent";
import { MONTH_NAMES_EN, WEEK_NAMES_EN } from "@/constants/calendar";

import { nextWeekURL } from "@/utils/nextWeek";
import { previousWeekURL } from "@/utils/previousWeek";
import { weekOfTodayURL } from "@/utils/weekOfToday";
import { eachDayOfInterval, getDay, getYear } from "date-fns";
import Link from "next/link";
import React from "react";

type PropsType = {
  params: Promise<{ year: string; month: string; date: string }>;
};

const WeekDisplayPage = ({ params }: PropsType) => {
  // クライアントコンポーネントを呼び出す時にCSSを切り替えるための変数
  const isMonth: boolean = false;

  // パラメーターから年と月を取得する
  const { year, month, date } = React.use(params);

  // paramsから受け取った基準となる日付
  let standardDate: Date = new Date(`${year}/${month}/${date}`);

  // 該当週の初日に当てられた曜日の番号を取得する
  const dayOfToday: number = getDay(standardDate);

  // 表示する1週間の初日と最終日の位置を決める
  let gapDateForFirstDate: number = 0;
  let gapDateForLastDate: number = 0;
  if (dayOfToday === 0) {
    gapDateForLastDate += 6;
  } else if (dayOfToday === 1) {
    gapDateForFirstDate += 1;
    gapDateForLastDate += 5;
  } else if (dayOfToday === 2) {
    gapDateForFirstDate += 2;
    gapDateForLastDate += 4;
  } else if (dayOfToday === 3) {
    gapDateForFirstDate += 3;
    gapDateForLastDate += 3;
  } else if (dayOfToday === 4) {
    gapDateForFirstDate += 4;
    gapDateForLastDate += 2;
  } else if (dayOfToday === 5) {
    gapDateForFirstDate += 5;
    gapDateForLastDate += 1;
  } else if (dayOfToday === 6) {
    gapDateForFirstDate += 6;
  }

  // 該当週の日付全てを配列として取得する。各月の最小 or 最大の日付を±の超過で過ぎてもDate関数で次月の日付を生成
  // 日付の取得には数値記入した内容から行う。1より少ない数字や31など(各月の最終日)を超える値は月を跨いだ日付を取得できる
  // 文字列で日付を指定・取得する場合は上記の機能は実現できない。
  let currentDates: Date[] = eachDayOfInterval({
    start: new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(date) - gapDateForFirstDate,
    ),
    end: new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(date) + gapDateForLastDate,
    ),
  });

  // 月から英名の月を選択
  const month_english: string = MONTH_NAMES_EN[parseInt(month) - 1];
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
              href={weekOfTodayURL()}
              className="rounded-4xl border px-4 py-1"
            >
              Today
            </Link>
            <Link
              suppressHydrationWarning
              href={previousWeekURL({ standardDate })}
            >
              &lt;
            </Link>
            <Link suppressHydrationWarning href={nextWeekURL({ standardDate })}>
              &gt;
            </Link>
            <span className="text-xl">{current_month_english}</span>
          </div>
          <div className="flex items-center">
            <Link
              href={`/month/${year}/${month}`}
              className="rounded-4xl border px-4 py-1"
            >
              Month
            </Link>
          </div>
        </div>
      </header>
      <div className="m-4 grid flex-1 grid-cols-7 overflow-hidden rounded-2xl bg-gray-50/80 shadow-xl">
        {WEEK_NAMES_EN.map((date) => (
          <div key={date} className="text-center">
            <span>{date}</span>
          </div>
        ))}
        {currentDates.map((date) => (
          <DataAndEventsComponent
            date={date}
            month={month}
            isMonth={isMonth}
            key={date.toString()}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekDisplayPage;
