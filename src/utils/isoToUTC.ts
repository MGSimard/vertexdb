export function isoToUTC(inputISO: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC", // Forces the date to be in UTC time
    timeZoneName: "short", // Displays 'UTC'
  });

  return formatter.format(inputISO);
}
