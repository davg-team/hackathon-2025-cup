import FullCalendar from "@fullcalendar/react";
import allLocales from "@fullcalendar/core/locales-all";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface PreparedEvent {
  title: string;
  start: string;
  end: string;
  allDay: true;
}

export default function Calendar({ events }: { events: PreparedEvent[] }) {
  return (
    <FullCalendar
      locales={allLocales}
      locale={"ru"}
      plugins={[dayGridPlugin, interactionPlugin]}
      events={events}
      firstDay={1}
    />
  );
}

