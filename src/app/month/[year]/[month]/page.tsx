import React from "react";
import Link from "next/link";
import { weekdayList } from "@/constants/weekdayList";
import {
  addMonths,
  eachDayOfInterval,
  format,
  getDay,
  getMonth,
  getYear,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";
import { monthList } from "@/constants/monthList";
import DataAndEventsComponent from "@/components/DateAndEventsComponent";

type PropsType = {
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<{ receivedEvents?: string; today: Date }>;
};

const MonthDisplayPage = ({ params, searchParams }: PropsType) => {
  // クライアントコンポーネントを呼び出す時にCSSを切り替えるための変数
  const isMonth: boolean = true;

  // パラメーターから年と月を取得する
  const { year, month } = React.use(params);

  // パラメーターから渡ってきたtodayを取り出す
  let { today } = React.use(searchParams);

  // 取得したパラメーターから年を取り出してnumber型に変換
  const passedYear: number = parseInt(year);

  // 取得したパラメーターから月を取り出してnumber型に変換。月は0〜11で1月〜12月を表すので注意。そのために1を引く
  const passedMonth: number = parseInt(month) - 1;

  // 当月の初日を取得する
  const firstDate: string = format(startOfMonth(today), "dd");
  // 当月の最終日を取得する
  const lastDate: string = format(lastDayOfMonth(today), "dd");
  // 当月の日付全てを配列として取得する
  let currentDays: Date[] = eachDayOfInterval({
    start: new Date(passedYear, passedMonth, parseInt(firstDate)),
    end: new Date(passedYear, passedMonth, parseInt(lastDate)),
  });
  // 取得したcurrentDaysを日付だけの配列に変換する
  let formattedDays: string[] = currentDays.map((day) => format(day, "d"));
  // 当月の初日に当てられた曜日の番号を取得する
  const firstDay: number = getDay(startOfMonth(today));
  // 月から英名の月を選択
  const month_english: string = monthList[passedMonth];
  // ヘッダーに表示する月(英名)と年を作成
  const current_month_english: string = month_english + " " + getYear(today);

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
              href={{
                pathname: `/month/${getYear(new Date())}/${getMonth(new Date()) + 1}`,
                query: { today: new Date().toLocaleDateString() },
              }}
              className="rounded-4xl border px-4 py-1"
            >
              Today
            </Link>
            <Link
              suppressHydrationWarning
              href={{
                pathname: `/month/${getYear(addMonths(today, -1))}/${getMonth(addMonths(today, -1)) + 1}`,
                query: {
                  today: addMonths(today, -1).toLocaleDateString(),
                },
              }}
            >
              &lt;
            </Link>
            <Link
              suppressHydrationWarning
              href={{
                pathname: `/month/${getYear(addMonths(today, 1))}/${getMonth(addMonths(today, 1)) + 1}`,
                query: {
                  today: addMonths(today, 1).toLocaleDateString(),
                },
              }}
            >
              &gt;
            </Link>
            <span className="text-xl">{current_month_english}</span>
          </div>
          <div className="flex items-center">
            <Link
              href={`/week/${passedYear}/${passedMonth + 1}/${format(today, "dd")}`}
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
        {formattedDays.map((day) => (
          <DataAndEventsComponent
            day={day}
            firstDay={firstDay}
            passedYear={passedYear}
            passedMonth={passedMonth}
            today={today}
            isMonth={isMonth}
            key={day}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthDisplayPage;
