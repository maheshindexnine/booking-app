import moment from "moment";

type DateItem = {
  label: string;
  value: string;
};

export function getNextDateItems(count: number): DateItem[] {
  const dates: DateItem[] = [];

  for (let i = 0; i < count; i++) {
    const day = moment().add(i, "days");
    dates.push({
      label: day.format("ddd, MMM D"),
      value: day.format("YYYY-MM-DD"),
    });
  }

  return dates;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const hourStr = hours > 0 ? `${hours}h` : "";
  const minStr = mins > 0 ? `${mins}m` : "";

  return `${hourStr} ${minStr}`.trim();
}
