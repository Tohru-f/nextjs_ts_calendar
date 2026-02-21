"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { weekdayList } from "@/constants/weekdayList";
import { changeStartPosition } from "@/utils/changeStartPosition";
import {
  addMonths,
  eachDayOfInterval,
  format,
  getDay,
  getYear,
  lastDayOfMonth,
  startOfMonth,
} from "date-fns";
import { monthList } from "@/constants/monthList";
import { checkEvents } from "@/utils/checkEvents";

import { compareDesignatedMonths } from "@/utils/compareDesignatedMonths";
import { useModal } from "@/contexts/ModalContexts";

import { useDisplay } from "@/contexts/DisplayContexts";
import { useRouter } from "next/navigation";
import { options } from "@/constants/options";
import { eventTypeZod } from "@/types/eventType";
import EventEditAndDeleteModal from "@/components/EventEditAndDeleteModal";
import EventCreateModal from "@/components/EventCreateModal";

type PropsType = {
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<{ receivedEvents?: string; today: Date }>;
};

const MonthDisplayPage = ({ params, searchParams }: PropsType) => {
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
  const { year, month } = React.use(params);

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

  const router = useRouter();

  // 月表示と週表示を切り替える
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "month") {
      router.push(
        `/month/${passedYear}/${passedMonth + 1}?receivedEvents=${JSON.stringify(events)}`,
      );
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
                pathname: "/",
                query: { receivedEvents: JSON.stringify(parsedEvents) },
              }}
              className="rounded-4xl border px-4 py-1"
            >
              Today
            </Link>
            <Link
              suppressHydrationWarning
              href={{
                pathname: compareDesignatedMonths({
                  today: addMonths(today, -1),
                  signal: "&lt;",
                }),
                query: {
                  receivedEvents: JSON.stringify(events),
                  today: addMonths(today, -1).toLocaleDateString(),
                },
              }}
            >
              &lt;
            </Link>
            <Link
              suppressHydrationWarning
              href={{
                pathname: compareDesignatedMonths({
                  today: addMonths(today, 1),
                  signal: "&gt;",
                }),
                query: {
                  receivedEvents: JSON.stringify(events),
                  today: addMonths(today, 1).toLocaleDateString(),
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
            className={changeStartPosition({ day, firstDay })}
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
              <span>{day}</span>
            </div>
            <div className="flex flex-col">
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

export default MonthDisplayPage;
