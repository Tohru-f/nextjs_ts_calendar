import DataAndEventsComponent from "@/components/DateAndEventsComponent";
import { monthList } from "@/constants/monthList";
import { weekdayList } from "@/constants/weekdayList";
import {
  addWeeks,
  eachDayOfInterval,
  format,
  getDay,
  getMonth,
  getYear,
} from "date-fns";
import Link from "next/link";
import React from "react";

type PropsType = {
  params: Promise<{ year: string; month: string; date: string }>;
  searchParams: Promise<{ receivedEvents?: string; today: Date }>;
};

const WeekDisplayPage = ({ params }: PropsType) => {
  // クライアントコンポーネントを呼び出す時にCSSを切り替えるための変数
  const isMonth: boolean = false;

  // パラメーターから年と月を取得する
  const { year, month, date } = React.use(params);

  // 取得したパラメーターから年を取り出してnumber型に変換
  const passedYear: number = parseInt(year);

  // 取得したパラメーターから月を取り出してnumber型に変換。月は0〜11で1月〜12月を表すので注意。そのために1を引く
  const passedMonth: number = parseInt(month) - 1;

  let today: Date = new Date(`${year}/${month}/${date}`);
  const currentDate: string = new Date().toLocaleDateString();
  const checkDates =
    format(today, "yyyy/MM") === format(currentDate, "yyyy/MM");

  // 該当週の初日に当てられた曜日の番号を取得する
  const dayOfToday: number = getDay(today);

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
  let currentDays: Date[] = eachDayOfInterval({
    start: new Date(
      passedYear,
      passedMonth,
      parseInt(date) - gapDateForFirstDate,
    ),
    end: new Date(passedYear, passedMonth, parseInt(date) + gapDateForLastDate),
  });

  // 取得したcurrentDaysを日付だけの配列に変換する
  let formattedDays: string[] = currentDays.map((day) => format(day, "d"));

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
                pathname: `/week/${getYear(new Date())}/${getMonth(new Date()) + 1}/${format(new Date(), "dd")}`,
              }}
              className="rounded-4xl border px-4 py-1"
            >
              Today
            </Link>
            <Link
              suppressHydrationWarning
              href={{
                pathname: `/week/${getYear(addWeeks(today, -1))}/${getMonth(addWeeks(today, -1)) + 1}/${format(addWeeks(today, -1), "dd")}`,
                query: {
                  today: addWeeks(today, -1).toLocaleDateString(),
                },
              }}
            >
              &lt;
            </Link>
            <Link
              suppressHydrationWarning
              href={{
                pathname: `/week/${getYear(addWeeks(today, 1))}/${getMonth(addWeeks(today, 1)) + 1}/${format(addWeeks(today, 1), "dd")}`,
                query: {
                  today: addWeeks(today, 1).toLocaleDateString(),
                },
              }}
            >
              &gt;
            </Link>
            <span className="text-xl">{current_month_english}</span>
          </div>
          <div className="flex items-center">
            <Link
              href={`/month/${passedYear}/${passedMonth + 1}?today=${today.toLocaleDateString()}`}
              className="rounded-4xl border px-4 py-1"
            >
              Month
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
            firstDay={dayOfToday}
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

export default WeekDisplayPage;
