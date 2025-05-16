import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FullCalendar from "@fullcalendar/react";
import UserAuth from "./UserAuth";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap5";
import { fetchEvents, deleteEvent } from "../services/slices/dataSlice";
import { supabase } from "../services/supabaseClient";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import CalendarDayView from "./CalendarDayView";
import AddEventModal from "./AddEventModal";

export default function AppCalendar({ isAuthenticated }) {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMobileDate, setSelectedMobileDate] = useState(null);
  const [noEndTime, setNoEndTime] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        dispatch(fetchEvents());
      }
    };

    if (isAuthenticated) {
      restoreSession();
    }
  }, [isAuthenticated, dispatch]);

  const formattedEvents = events.map((event) => ({
    id: event.event_id, // Map the event_id column to the id property
    description: event.description,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
  }));

  const handleDateClick = (info) => {
    const formattedDate = info.dateStr; // FullCalendar provides the date in YYYY-MM-DD format

    // Get the current time in the user's local timezone
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    setSelectedDate(formattedDate); // Set the clicked date

    setFormData({
      title: "",
      description: "",
      startTime: `${formattedDate}T${currentTime}`, // Prefill with local date and time
      endTime: `${formattedDate}T${currentTime}`, // Prefill with local date and time
    });

    // setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        alert("You must be logged in to add an event.");
        return;
      }

      const localStartTime = new Date(formData.startTime).toISOString();
      const localEndTime = noEndTime
        ? null
        : new Date(formData.endTime).toISOString();

      const { error } = await supabase.from("events").insert([
        {
          title: formData.title,
          description: formData.description,
          start_time: localStartTime,
          end_time: localEndTime, // Use null if noEndTime is true
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error("Error adding event:", error.message);
        alert("Failed to add the event. Please try again.");
      } else {
        alert("Event added successfully!");
        dispatch(fetchEvents()); // Refresh events
        setShowModal(false); // Close the modal
        setFormData({ title: "", description: "", startTime: "", endTime: "" }); // Reset form
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="ms-3 text-primary">Fetching Calendar Events...</h5>
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const today = new Date().toISOString().split("T")[0];
  const handleButtonClick = () => {
    setShowModal(true);
    setFormData({
      title: "",
      description: "",
      startTime: `${selectedDate || today}T00:00:00`, // Start at midnight of the selected day
      endTime: `${selectedDate || today}T23:59:59`, // End at the last minute of the selected day
    });
  };

  const hasEventOnDate = (date) => {
    // Format date as YYYY-MM-DD for comparison
    const dateStr = date.toISOString().split("T")[0];
    return formattedEvents.some(
      (event) => event.start.split("T")[0] === dateStr
    );
  };

  return (
    <div className="calendar-mobile-layout d-flex flex-column-reverse flex-md-row gap-2">
      <div className="calendar-bottom" style={{ flex: "1 1 25%" }}>
        {isMobileView ? (
          <div className="d-flex flex-column justify-content-between align-items-center mb-2">
            <h5 className="text-primary">
              {selectedMobileDate
                ? selectedMobileDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No Date"}
            </h5>{" "}
            <Button
              variant="primary"
              onClick={handleButtonClick}
              className="btn btn-primary"
            >
              Add Event
            </Button>
          </div>
        ) : (
          <CalendarDayView
            onButtonClick={handleButtonClick}
            selectedDate={selectedDate}
            events={formattedEvents}
          />
        )}
      </div>
      <div className="calendar-top" style={{ flex: "2 1 75%" }}>
        {isMobileView ? (
          <div className="modern-mobile-calendar-wrapper">
            <Calendar
              onChange={setSelectedMobileDate}
              value={
                selectedMobileDate ? new Date(selectedMobileDate) : new Date()
              }
              onClickDay={(date) => {
                setSelectedMobileDate(date);
              }}
              className="react-calendar modern-mobile-calendar"
              tileClassName={({ date, view }) => {
                if (view === "month" && hasEventOnDate(date)) {
                  return "calendar-has-event";
                }

                if (
                  view === "month" &&
                  date.toDateString() === new Date().toDateString()
                ) {
                  return "highlight";
                }
                return null;
              }}
            />
          </div>
        ) : (
          <FullCalendar
            height={"90vh"}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              bootstrapPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            themeSystem="bootstrap5"
            events={isAuthenticated ? formattedEvents : []}
            dateClick={handleDateClick}
            eventClick={async (info) => {
              const confirmDelete = window.confirm(
                `Are you sure you want to delete the event "${info.event.title}"?`
              );
              if (confirmDelete) {
                dispatch(deleteEvent(info.event.id));
                try {
                  const { error } = await supabase
                    .from("events")
                    .delete()
                    .eq("event_id", info.event.id);

                  if (error) {
                    console.error("Error deleting event:", error.message);
                    alert("Failed to delete the event. Please try again.");
                  } else {
                    console.log("Event deleted from database:", info.event.id);
                    alert("Event deleted successfully!");
                    dispatch(fetchEvents()); // Refresh events
                  }
                } catch (err) {
                  console.error("Unexpected error:", err);
                  alert("An unexpected error occurred. Please try again.");
                }
              }
            }}
          />
        )}
      </div>

      {/* Modal for Adding Events */}
      <AddEventModal
        show={showModal}
        setShowModal={setShowModal}
        onHide={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleAddEvent={handleAddEvent}
        noEndTime={noEndTime}
        setNoEndTime={setNoEndTime}
      />
    </div>
  );
}
