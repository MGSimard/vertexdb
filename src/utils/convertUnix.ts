export const convertUnix = (unix: number) => {
  const date = new Date(unix * 1000);
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
  return date.toLocaleString("en-US", options);
};
