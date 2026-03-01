import React from "react";
import Link from "next/link";

import {
  eachDayOfInterval,
  endOfWeek,
  getYear,
  lastDayOfMonth,
  startOfWeek,
} from "date-fns";

import DataAndEventsComponent from "@/components/DateAndEventsComponent";
import { nextMonthURL } from "@/utils/nextMonth";
import { previousMonthURL } from "@/utils/previousMonth";
import { monthOfTodayURL } from "@/utils/monthOfToday";
import { MONTH_NAMES_EN, WEEK_NAMES_EN } from "@/constants";
import EventCreateModal from "@/components/EventCreateModal";
import EventEditAndDeleteModal from "@/components/EventEditAndDeleteModal";

type PropsType = {
  params: Promise<{ year: string; month: string }>;
};

const MonthDisplayPage = ({ params }: PropsType) => {
  // パラメーターから年と月を取得する
  const { year, month } = React.use(params);

  // 当月の基準となる初日の日付
  const firstDate = new Date(`${year}/${month}/1`);

  // 当月の日付全てを配列として取得する。
  const currentDates: Date[] = eachDayOfInterval({
    start: startOfWeek(firstDate),
    end: endOfWeek(lastDayOfMonth(firstDate)),
  });

  // 月から英名の月を選択
  const monthNameEn: string = MONTH_NAMES_EN[parseInt(month) - 1];

  // ヘッダーに表示する月(英名)と年を作成
  const headerTitle: string = monthNameEn + " " + getYear(firstDate);

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
              href={previousMonthURL({ firstDate })}
            >
              &lt;
            </Link>
            <Link suppressHydrationWarning href={nextMonthURL({ firstDate })}>
              &gt;
            </Link>
            <span className="text-xl">{headerTitle}</span>
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
        {WEEK_NAMES_EN.map((date) => (
          <div key={date} className="text-center">
            <span>{date}</span>
          </div>
        ))}
        {currentDates.map((date) => (
          <DataAndEventsComponent
            date={date}
            month={month}
            isMonth={true}
            key={date.toString()}
          />
        ))}
      </div>
      <EventCreateModal />
      <EventEditAndDeleteModal />
    </div>
  );
};

export default MonthDisplayPage;
