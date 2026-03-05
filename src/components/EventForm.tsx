"use client";

import React from "react";

type PropsType = {
  title: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: Date;
  errorMessage: string[] | undefined;
  close: () => void;
};

const EventForm = ({
  title,
  handleChange,
  date,
  errorMessage,
  close,
}: PropsType) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="ml-auto flex justify-end">
        <button className="text-white" onClick={close}>
          ✖︎
        </button>
      </div>
      <span className="text-white">イベント名</span>
      <input
        className="rounded-md border border-white text-white"
        type="text"
        placeholder="イベント"
        name="title"
        value={title}
        onChange={handleChange}
        autoFocus
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <span className="text-white">日付</span>
      <input
        className="rounded-md border border-white text-white"
        type="text"
        placeholder="年/月/日"
        name="date"
        value={date.toLocaleDateString()}
        readOnly
      />
    </div>
  );
};

export default EventForm;
