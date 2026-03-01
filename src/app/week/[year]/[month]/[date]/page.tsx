import DataAndEventsComponent from "@/components/DateAndEventsComponent";
import EventCreateModal from "@/components/EventCreateModal";
import EventEditAndDeleteModal from "@/components/EventEditAndDeleteModal";
import { MONTH_NAMES_EN, WEEK_NAMES_EN } from "@/constants/calendar";

import { nextWeekURL } from "@/utils/nextWeek";
import { previousWeekURL } from "@/utils/previousWeek";
import { weekOfTodayURL } from "@/utils/weekOfToday";
import { eachDayOfInterval, endOfWeek, getYear, startOfWeek } from "date-fns";
import Link from "next/link";
import React from "react";

type PropsType = {
  params: Promise<{ year: string; month: string; date: string }>;
};

const WeekDisplayPage = ({ params }: PropsType) => {
  // パラメーターから年と月を取得する
  const { year, month, date } = React.use(params);

  // paramsから受け取った基準となる日付
  let standardDate: Date = new Date(`${year}/${month}/${date}`);

  // 該当週の日付全てを配列として取得する。
  const currentDates: Date[] = eachDayOfInterval({
    start: startOfWeek(standardDate),
    end: endOfWeek(standardDate),
  });

  // 月から英名の月を選択
  const monthNameEn: string = MONTH_NAMES_EN[parseInt(month) - 1];
  // ヘッダーに表示する月(英名)と年を作成
  const headerTitle: string = monthNameEn + " " + getYear(standardDate);

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
            <span className="text-xl">{headerTitle}</span>
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
            isMonth={false}
            key={date.toString()}
          />
        ))}
      </div>
      <EventCreateModal />
      <EventEditAndDeleteModal />
    </div>
  );
};

export default WeekDisplayPage;
