import { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap5";

export default function CalendarDayView({ selectedDate, events }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00"); // Force local timezone
    return date.toLocaleDateString();
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start).toLocaleDateString();
    return eventDate === formatDate(selectedDate);
  });

  useEffect(() => {
    console.log("Filtered Events:", filteredEvents);
  }, [filteredEvents]);

  return (
    <div
      className="container d-flex flex-column border border-2 rounded-3 p-3"
      style={{ height: "90vh" }}
    >
      <h4 className="text-center">
        Events for{" "}
        {selectedDate ? formatDate(selectedDate) : "No Date Selected"}
      </h4>
      <div>
        {selectedDate ? (
          <FullCalendar
            key={selectedDate}
            themeSystem="bootstrap5"
            plugins={[listPlugin, interactionPlugin, bootstrapPlugin]}
            initialView="listDay"
            initialDate={selectedDate}
            headerToolbar={false}
            events={filteredEvents}
            noEventsContent="No events for this day."
          />
        ) : (
          <p>No date selected</p>
        )}
      </div>
    </div>
  );
}
