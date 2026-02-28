"use client";

import React from "react";
import { checkEvents } from "@/utils/checkEvents";
import EventCreateModal from "./EventCreateModal";
import EventEditAndDeleteModal from "./EventEditAndDeleteModal";
import { useModal } from "@/contexts/ModalContexts";
import { compareDates } from "@/utils/compareDates";
import { getDate } from "date-fns";
import { today } from "@/constants/calendar";

type PropsType = {
  date: Date;
  month: string;
  isMonth: boolean;
};

const DataAndEventsComponent = ({ date, month, isMonth }: PropsType) => {
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
            ? "flex flex-col border border-gray-300 text-center"
            : "flex h-screen flex-col border border-gray-300 text-center"
        }
        onClick={() => openModalHandler(date)}
        role="button"
        tabIndex={0}
      >
        <div className="p-1">
          <span className={compareDates(today, date, month)}>
            {getDate(date)}
          </span>
        </div>
        <div className="flex flex-col">
          {events &&
            checkEvents({
              events,
              date,
            }).map((event) => (
              <button
                suppressHydrationWarning
                key={event.id}
                className="rounded-md bg-blue-300 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  openChangeModalHandler(date, event.id);
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
