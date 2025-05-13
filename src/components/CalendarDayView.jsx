import { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap5";

export default function CalendarDayView({
  selectedDate,
  events,
  onButtonClick,
}) {
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
      className="container d-flex flex-column border border-1 rounded-3 p-3"
      style={{ height: "90vh" }}
    >
      <h4 className="text-center">
        Events for{" "}
        {selectedDate
          ? formatDate(selectedDate)
          : new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
      </h4>
      <div className="border border-1 rounded-3">
        {selectedDate ? (
          <FullCalendar
            key={selectedDate}
            themeSystem="bootstrap5"
            plugins={[listPlugin, interactionPlugin, bootstrapPlugin]}
            initialView="listDay"
            initialDate={selectedDate}
            headerToolbar={false}
            events={filteredEvents}
          />
        ) : (
          <FullCalendar
            themeSystem="bootstrap5"
            plugins={[listPlugin, interactionPlugin, bootstrapPlugin]}
            initialView="listDay"
            initialDate={new Date().toISOString().split("T")[0]} // Today's date
            headerToolbar={false}
            events={filteredEvents}
          />
        )}
      </div>
      <button onClick={onButtonClick} className="btn btn-outline-primary mt-3">
        <i className="bi bi-plus-circle"></i> Add Event
      </button>
    </div>
  );
}
