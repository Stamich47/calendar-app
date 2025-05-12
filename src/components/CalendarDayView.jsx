import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

export default function CalendarDayView({ selectedDate, events }) {
  useEffect(() => {
    if (selectedDate) {
      console.log("Selected date changed:", selectedDate);
    }
  }, [selectedDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00"); // Force local timezone
    return date.toLocaleDateString();
  };

  return (
    <div>
      <h3>
        Events for{" "}
        {selectedDate ? formatDate(selectedDate) : "No Date Selected"}
      </h3>
      {selectedDate ? (
        <FullCalendar
          key={selectedDate}
          plugins={[listPlugin]}
          initialView="listDay"
          initialDate={selectedDate}
          headerToolbar={false}
          events={events}
          noEventsContent="No events for this day."
        />
      ) : (
        <p>No date selected</p>
      )}
    </div>
  );
}
