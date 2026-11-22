import { ARSAEvent } from "@/types";

/**
 * Generates an iCalendar (.ics) string for an ARSA event
 */
export function generateIcsCalendar(event: ARSAEvent): string {
  const formatDateToIcs = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    } catch {
      return "";
    }
  };

  const start = formatDateToIcs(event.startDate);
  const end = formatDateToIcs(event.endDate || event.startDate);
  const now = formatDateToIcs(new Date().toISOString());

  const summary = `${event.title} - ARSA RSCOE`;
  const description = `${event.tagline}\\n\\nVenue: ${event.venue}\\nRegistration Mode: ${event.registrationMode}\\n\\nOrganized by ARSA, Dept of Automation & Robotics, JSPM RSCOE Pune.`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ARSA RSCOE//Events Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:arsa-${event.id}-${Date.now()}@jspmrscoe.edu.in`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${event.venue.replace(/,/g, "\\,")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

/**
 * Triggers a browser download of the .ics file
 */
export function downloadEventIcs(event: ARSAEvent): void {
  const icsString = generateIcsCalendar(event);
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.slug || "arsa-event"}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Returns a Google Calendar web link for one-click add
 */
export function getGoogleCalendarUrl(event: ARSAEvent): string {
  const formatGCalDate = (iso: string) => {
    return new Date(iso).toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const start = formatGCalDate(event.startDate);
  const end = formatGCalDate(event.endDate || event.startDate);

  const title = encodeURIComponent(`${event.title} | ARSA RSCOE`);
  const details = encodeURIComponent(
    `${event.tagline}\n\nVenue: ${event.venue}\nOrganized by Automation & Robotics Student Association, JSPM RSCOE Pune.`
  );
  const location = encodeURIComponent(event.venue);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}
