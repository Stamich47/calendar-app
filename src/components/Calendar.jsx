import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "./../services/slices/dataSlice";
import { supabase } from "../services/supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import "@fullcalendar/bootstrap5";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Calendar() {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEvents());
    }

    const subscription = supabase
      .channel("realtime:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          console.log("Change received!", payload);

          dispatch(fetchEvents());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [status, dispatch]);

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="calendar-container">
      <FullCalendar
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          bootstrapPlugin,
          resourceTimelinePlugin,
        ]}
        dateClick={(info) => {
          const currentView = info.view.calendar;
          currentView.changeView("timeGridDay", info.dateStr);
        }}
        eventClick={(info) => {
          const currentView = info.view.calendar;
          currentView.changeView("timeGridDay", info.event.startStr);
        }}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: `title`,
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        themeSystem="bootstrap5"
        events={events}
      />
    </div>
  );
}
