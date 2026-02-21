"use client";

import EventCreateModal from "@/components/EventCreateModal";
import EventEditAndDeleteModal from "@/components/EventEditAndDeleteModal";

import { monthList } from "@/constants/monthList";
import { options } from "@/constants/options";
import { weekdayList } from "@/constants/weekdayList";
import { useDisplay } from "@/contexts/DisplayContexts";
import { useModal } from "@/contexts/ModalContexts";
import { eventTypeZod } from "@/types/eventType";

import { checkEvents } from "@/utils/checkEvents";
import { compareDates } from "@/utils/compareDates";
import {
  addWeeks,
  eachDayOfInterval,
  format,
  getDay,
  getMonth,
  getYear,
} from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type PropsType = {
  params: Promise<{ year: string; month: string; date: string }>;
  searchParams: Promise<{ receivedEvents?: string; today: Date }>;
};

const WeekDisplayPage = ({ params, searchParams }: PropsType) => {
  const {
    events,
    setEvents,
    showEventModal,
    showEventChangeModal,
    designatedDate,
    designatedId,
    openModalHandler,
    openChangeModalHandler,
    closeModalHandler,
    closeChangeModalHandler,
  } = useModal();

  // 月と週の表示を切り替えるためのstate変数・set関数
  const { selectedOption, setSelectedOption } = useDisplay();

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
    gapDateForLastDate + 6;
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

  // 他のURLから遷移してきた時にクエリパラメーターからイベントを受け取り、JSONからオブジェクトに変換
  const { receivedEvents } = React.use(searchParams);
  const parsedEvents: eventTypeZod[] = receivedEvents
    ? JSON.parse(receivedEvents)
    : [];

  // 初期レンダリングでイベントが渡ってきていたらset関数で更新して表示に使う
  useEffect(() => {
    if (parsedEvents) {
      setEvents(parsedEvents);
    }
  }, []);

  // 月から英名の月を選択
  const month_english: string = monthList[passedMonth];
  // ヘッダーに表示する月(英名)と年を作成
  const current_month_english: string = month_english + " " + getYear(today);

  const router = useRouter();

  // 月表示と週表示を切り替える
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "month") {
      if (checkDates) {
        router.push(`/?receivedEvents=${JSON.stringify(events)}`);
      } else {
        router.push(
          `/month/${passedYear}/${passedMonth + 1}?today=${today.toLocaleDateString()}&receivedEvents=${JSON.stringify(events)}`,
        );
      }
    } else {
      router.push(
        `/week/${passedYear}/${passedMonth + 1}/${format(today, "dd")}?receivedEvents=${JSON.stringify(events)}`,
      );
    }
    setSelectedOption(event.target.value);
  };

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
                query: { receivedEvents: JSON.stringify(events) },
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
                  receivedEvents: JSON.stringify(events),
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
                  receivedEvents: JSON.stringify(events),
                  today: addWeeks(today, 1).toLocaleDateString(),
                },
              }}
            >
              &gt;
            </Link>
            <span className="text-xl">{current_month_english}</span>
          </div>
          <div className="flex items-center">
            <select
              value={selectedOption}
              onChange={handleOptionChange}
              className="rounded-4xl border px-4 py-1"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
          <div
            key={day}
            className="flex h-screen flex-col border border-gray-300 text-center"
            onClick={() =>
              openModalHandler(
                new Date(
                  passedYear,
                  passedMonth,
                  parseInt(day),
                ).toLocaleDateString(),
              )
            }
          >
            <div>
              <span
                className={
                  compareDates(
                    new Date(),
                    new Date(passedYear, passedMonth, parseInt(day)),
                  )
                    ? "rounded-full border border-solid border-orange-500 bg-orange-500 px-2 py-1"
                    : ""
                }
              >
                {day}
              </span>
            </div>
            <div className="align-center flex flex-col">
              {events &&
                checkEvents({
                  events,
                  day,
                  selectedDay: today,
                  currentMonth: passedMonth,
                }).map((event) => (
                  <span
                    key={event.id}
                    className="rounded-md bg-blue-300 text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      openChangeModalHandler(
                        new Date(
                          passedYear,
                          passedMonth,
                          parseInt(day),
                        ).toLocaleDateString(),
                        event.id,
                      );
                    }}
                  >
                    {event.title}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
      <EventCreateModal
        show={showEventModal}
        close={closeModalHandler}
        date={designatedDate}
        setEvents={setEvents}
        events={events}
      />
      <EventEditAndDeleteModal
        show={showEventChangeModal}
        close={closeChangeModalHandler}
        date={designatedDate}
        id={designatedId}
        setEvents={setEvents}
        events={events}
      />
    </div>
  );
};

export default WeekDisplayPage;
