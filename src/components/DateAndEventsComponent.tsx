"use client";

import React from "react";
import { changeStartPosition } from "@/utils/changeStartPosition";
import { checkEvents } from "@/utils/checkEvents";
import EventCreateModal from "./EventCreateModal";
import EventEditAndDeleteModal from "./EventEditAndDeleteModal";
import { useModal } from "@/contexts/ModalContexts";
import { compareDates } from "@/utils/compareDates";
import { getDate } from "date-fns";

type PropsType = {
  day: Date;
  firstDay: number;
  year: string;
  month: string;
  today: Date;
  isMonth: boolean;
};

const DataAndEventsComponent = ({
  day,
  firstDay,
  year,
  month,
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
        className={
          isMonth
            ? changeStartPosition({ day, firstDay })
            : "flex h-screen flex-col border border-gray-300 text-center"
        }
        onClick={() =>
          openModalHandler(
            new Date(parseInt(year), parseInt(month) - 1, getDate(day)),
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
                new Date(parseInt(year), parseInt(month) - 1, getDate(day)),
              )
                ? "rounded-full border border-solid border-orange-500 bg-orange-500 px-2 py-2"
                : ""
            }
          >
            {getDate(day)}
          </span>
        </div>
        <div className="flex flex-col">
          {events &&
            checkEvents({
              events,
              day,
              selectedDay: today,
              currentMonth: parseInt(month) - 1,
            }).map((event) => (
              <button
                suppressHydrationWarning
                key={event.id}
                className="rounded-md bg-blue-300 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  openChangeModalHandler(
                    new Date(parseInt(year), parseInt(month) - 1, getDate(day)),
                    event.id,
                  );
                }}
              >
                {event.title}
              </button>
            ))}
        </div>
      </div>
      {showEventModal && (
        <EventCreateModal
          show={showEventModal}
          close={closeModalHandler}
          date={designatedDate}
          setEvents={setEvents}
          events={events}
        />
      )}
      {showEventChangeModal && (
        <EventEditAndDeleteModal
          show={showEventChangeModal}
          close={closeChangeModalHandler}
          date={designatedDate}
          id={designatedId}
          setEvents={setEvents}
          events={events}
        />
      )}
    </>
  );
};

export default DataAndEventsComponent;
