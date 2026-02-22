"use client";

import React from "react";
import { changeStartPosition } from "@/utils/changeStartPosition";
import { checkEvents } from "@/utils/checkEvents";
import EventCreateModal from "./EventCreateModal";
import EventEditAndDeleteModal from "./EventEditAndDeleteModal";
import { useModal } from "@/contexts/ModalContexts";
import { compareDates } from "@/utils/compareDates";

type PropsType = {
  day: string;
  firstDay: number;
  passedYear: number;
  passedMonth: number;
  today: Date;
  isMonth: boolean;
};

const DataAndEventsComponent = ({
  day,
  firstDay,
  passedYear,
  passedMonth,
  today,
  isMonth,
}: PropsType) => {
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

  return (
    <>
      <div
        suppressHydrationWarning
        key={day}
        className={
          isMonth
            ? changeStartPosition({ day, firstDay })
            : "flex h-screen flex-col border border-gray-300 text-center"
        }
        onClick={() =>
          openModalHandler(
            new Date(
              passedYear,
              passedMonth,
              parseInt(day),
            ).toLocaleDateString(),
          )
        }
        role="button"
        tabIndex={0}
      >
        <div className="p-1">
          <span
            className={
              compareDates(
                new Date(),
                new Date(passedYear, passedMonth, parseInt(day)),
              )
                ? "rounded-full border border-solid border-orange-500 bg-orange-500 px-2 py-2"
                : ""
            }
          >
            {day}
          </span>
        </div>
        <div className="flex flex-col">
          {events &&
            checkEvents({
              events,
              day,
              selectedDay: today,
              currentMonth: passedMonth,
            }).map((event) => (
              <button
                suppressHydrationWarning
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
              </button>
            ))}
        </div>
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
    </>
  );
};

export default DataAndEventsComponent;
