/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import Calendar from "features/components/Calendar";
import { useNavigate } from "react-router-dom";

interface PreparedEvent {
  title: string;
  start: string;
  end: string;
  allDay: true;
  id: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  type:
    | "school"
    | "city"
    | "regional"
    | "interregional"
    | "russian"
    | "international";
  status: "on_verification" | "verified" | "declined" | "published" | "draft";
  discipline: "algorithms" | "hackathon" | "cybersecurity";
  start_date: string;
  end_date: string;
}

const CalendarView = ({ events }: { events: Event[] }) => {
  const [preparedEvents, setPreparedEvents] = useState<PreparedEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPreparedEvents(
      events.map((event: Event) => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        endDate.setDate(endDate.getDate() + 1);
        return {
          title: event.title,
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
          allDay: true,
          id: event.id, // Добавлено поле id для перехода
        };
      }),
    );
  }, [events]);

  const handleEventClick = (event: any) => {
    navigate(`/competitions/${event.id}`); // Исправлено: передается id события
  };

  return <Calendar events={preparedEvents} onEventClick={handleEventClick} />;
};

export default CalendarView;

