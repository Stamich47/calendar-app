import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap5";
import { fetchEvents } from "../services/slices/dataSlice";
import { supabase } from "../services/supabaseClient";

export default function Calendar({ isAuthenticated }) {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error restoring session:", error.message);
        return;
      }

      if (user) {
        console.log("Session restored for user:", user);
        setUser(user);
        dispatch(fetchEvents());
      } else {
        setUser(null); // Clear user state when logged out
      }
    };

    if (isAuthenticated) {
      restoreSession();
    } else {
      setUser(null); // Clear user state when logged out
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return; // Only subscribe if the user is authenticated

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
  }, [isAuthenticated, dispatch]);

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
  }));

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
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        themeSystem="bootstrap5"
        events={isAuthenticated ? formattedEvents : []} // Clear events if not authenticated
        dateClick={(info) => {
          console.log("Date clicked:", info.dateStr);
        }}
        eventClick={(info) => {
          console.log("Event clicked:", info.event);
        }}
      />
    </div>
  );
}
