export interface Event {
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

export async function fetchEvents(region: string): Promise<Event[] | null> {
  const url = `/api/events?status=verified&${
    region ? "organization_id=" + region : ""
  }`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return null;
  }
}
