export const fetchPublicEvents = async (apiKey, calendarId = "primary") => {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items) {
      return data.items.map((event) => ({
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));
    } else {
      console.error("No events found or invalid response:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
