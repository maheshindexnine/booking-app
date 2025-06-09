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
