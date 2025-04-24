/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import Calendar from "features/components/Calendar";
import { Event } from "../Events";

interface PreparedEvent {
  title: string;
  start: string;
  end: string;
  allDay: true;
}

const CalendarView = ({ events }: { events: Event[] }) => {
  const [preparedEvents, setPreparedEvents] = useState<PreparedEvent[]>([]);

  useEffect(() => {
    setPreparedEvents(
      events.map((event: Event) => {
        const startDate = new Date(event.start_date);
        startDate.setDate(startDate.getDate());
        const endDate = new Date(event.end_date);
        endDate.setDate(endDate.getDate() + 1);
        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
        console.log(start);
        return {
          title: event.title,
          start: start,
          end: end,
          allDay: true,
        };
      }),
    );
  }, []);

  useEffect(() => {
    setPreparedEvents(
      events.map((event: Event) => {
        const startDate = new Date(event.start_date);
        startDate.setDate(startDate.getDate());
        const endDate = new Date(event.end_date);
        endDate.setDate(endDate.getDate() + 1);
        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
        console.log(start);
        return {
          title: event.title,
          start: start,
          end: end,
          allDay: true,
        };
      }),
    );
  }, [events]);

  return <Calendar events={preparedEvents} />;
};

export default CalendarView;
