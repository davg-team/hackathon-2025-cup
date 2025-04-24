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

interface CalendarProps {
  events: PreparedEvent[];
  onEventClick?: (event: any) => void;
}

export default function Calendar({ events, onEventClick }: CalendarProps) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <FullCalendar
        locales={allLocales}
        locale={"ru"}
        plugins={[dayGridPlugin, interactionPlugin]}
        events={events}
        firstDay={1}
        eventClick={(info) => onEventClick?.(info.event)} // Добавлено событие клика
        height="auto" // Увеличение размера календаря
      />
    </div>
  );
}

