import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function PostInput() {
  const [formData, setFormData] = useState({
    reminder: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { reminder, startTime, endTime } = formData;

    try {
      const { data, error } = await supabase.from("events").insert([
        {
          title: reminder,
          start: startTime,
          end: endTime,
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error.message);
        alert("Failed to submit the event. Please try again.");
      } else {
        console.log("Data inserted successfully:", data);
        alert("Event submitted successfully!");
        setFormData({ reminder: "", startTime: "", endTime: "" });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Event</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="reminder" className="form-label">
            Reminder
          </label>
          <input
            type="text"
            id="reminder"
            name="reminder"
            className="form-control"
            value={formData.reminder}
            onChange={handleChange}
            placeholder="Enter a reminder"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            className="form-control"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            className="form-control"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
