import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AddEventModal({
  show,
  setShowModal,
  formData,
  setFormData,
  noEndTime,
  setNoEndTime,
  handleAddEvent,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShowModal(false);
        setFormData({ title: "", description: "", startTime: "", endTime: "" }); // Reset form data
      }}
      onShow={() => {
        setNoEndTime(false); // Reset noEndTime to false when modal is opened
        setFormData((prevData) => ({
          ...prevData,
          endTime: prevData.endTime || new Date().toISOString(), // Ensure endTime has a default value
        }));
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">Add Event</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="form-label fw-bold">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control shadow-sm"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter event title"
            />
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="startTime" className="form-label fw-bold">
                Start Time
              </label>
              <DatePicker
                selected={
                  formData.startTime ? new Date(formData.startTime) : null
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: date.toISOString(), // Store in ISO format for consistency
                  }))
                }
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="MMMM dd, yyyy h:mm aa"
                className="form-control shadow-sm"
                placeholderText="Select start time"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endTime" className="form-label fw-bold">
                End Time
              </label>
              <DatePicker
                selected={formData.endTime ? new Date(formData.endTime) : null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: date.toISOString(), // Store in ISO format for consistency
                  }))
                }
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="MMMM dd, yyyy h:mm aa"
                className="form-control shadow-sm"
                placeholderText="Select end time"
                disabled={noEndTime}
              />
            </div>
          </div>
          <div className="form-check mb-4">
            <input
              type="checkbox"
              id="noEndTime"
              name="noEndTime"
              className="form-check-input"
              onChange={(e) => {
                const isChecked = e.target.checked;
                setNoEndTime(isChecked);
                setFormData((prevData) => ({
                  ...prevData,
                  endTime: isChecked ? "" : prevData.endTime,
                }));
              }}
            />
            <label htmlFor="noEndTime" className="form-check-label fw-bold">
              No End Time
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="form-label fw-bold">
              Notes
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control shadow-sm"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Add additional notes or details about the event"
            ></textarea>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={() => setShowModal(false)}
          className="px-4"
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleAddEvent}
          className="px-4 shadow-sm"
        >
          Add Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
