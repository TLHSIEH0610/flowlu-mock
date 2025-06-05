"use client";

const CalendarWidget = () => {
  const now = new Date();
  const day = now.getDate();
  const weekday = now.toLocaleDateString(undefined, { weekday: "short" });

  return (
    <div className="flex items-center bg-[#26263E] text-white px-3 py-2 rounded">
      <div className="text-center">
        <div className="text-xs text-gray-400">{weekday}</div>
        <div className="text-2xl font-bold">{day}</div>
      </div>
      <div className="border-l border-blue-600 h-8 mx-2" />
      <div className="flex flex-col justify-center">
        <span className="text-sm font-semibold">Calendar</span>
        <span className="text-xs text-gray-400">New Event</span>
      </div>
    </div>
  );
};

export default CalendarWidget;
