import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function Calendar({ isAuthenticated }) {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

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
    id: event.event_id, // Map the event_id column to the id property
    title: event.title,
    start: event.start_time,
    end: event.end_time,
  }));

  const handleDateClick = (info) => {
    const currentDate = new Date();
    const formattedDate = info.dateStr;

    // Get the current time in the user's local timezone
    const currentTime = currentDate.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    setSelectedDate(formattedDate); // Set the clicked date
    setFormData({
      title: "",
      startTime: `${formattedDate}T${currentTime}`, // Prefill with local date and time
      endTime: `${formattedDate}T${currentTime}`, // Prefill with local date and time
    });
    setShowModal(true); // Open the modal
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

      const { error } = await supabase.from("events").insert([
        {
          title: formData.title,
          start_time: formData.startTime || selectedDate,
          end_time: formData.endTime || selectedDate,
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
        setFormData({ title: "", startTime: "", endTime: "" }); // Reset form
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

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
          left: "prev",
          center: "title",
          right: "next",
        }}
        themeSystem="bootstrap5"
        events={isAuthenticated ? formattedEvents : []}
        dateClick={handleDateClick} // Open modal on date click
        eventClick={async (info) => {
          console.log("Event clicked:", info.event); // Debug log
          console.log("Event ID:", info.event.id); // Debug log

          const confirmDelete = window.confirm(
            `Are you sure you want to delete the event "${info.event.title}"?`
          );
          if (confirmDelete) {
            try {
              const { error } = await supabase
                .from("events")
                .delete()
                .eq("event_id", info.event.id); // Ensure this matches your database schema

              if (error) {
                console.error("Error deleting event:", error.message);
                alert("Failed to delete the event. Please try again.");
              } else {
                console.log("Event deleted from database:", info.event.id);
                alert("Event deleted successfully!");
                dispatch(deleteEvent(info.event.id)); // Dispatch the delete action
              }
            } catch (err) {
              console.error("Unexpected error:", err);
              alert("An unexpected error occurred. Please try again.");
            }
          }
        }}
      />

      {/* Modal for Adding Events */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="startTime" className="form-label">
                Start Time
              </label>
              <DatePicker
                selected={
                  formData.startTime ? new Date(formData.startTime) : null
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: date.toISOString(),
                  }))
                }
                showTimeSelect
                dateFormat="MMMM dd-yyyy HH:mm"
                className="form-control"
                placeholderText="Select start time"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endTime" className="form-label">
                End Time
              </label>
              <DatePicker
                selected={formData.endTime ? new Date(formData.endTime) : null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: date.toISOString(),
                  }))
                }
                showTimeSelect
                dateFormat="MMMM dd-yyyy HH:mm"
                className="form-control"
                placeholderText="Select end time"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
