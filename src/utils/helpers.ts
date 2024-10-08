export const flatnamed = (input: string) => {
  return input.toLowerCase().replace(/[^\wé'-]+/g, "-");
};

/**
 * Thumbnail-sized Cover: "cover_small"
 * Card-sized Cover: "720p"
 * https://images.igdb.com/igdb/image/upload/t_${sizeName}/${image_id}.jpg
 */
export const coverPath = (sizeName: "cover_small" | "720p", image_id: string) => {
  return `https://images.igdb.com/igdb/image/upload/t_${sizeName}/${image_id}.jpg`;
};

export const convertUnix = (unix: number) => {
  const date = new Date(unix * 1000);
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
  return date.toLocaleString("en-US", options);
};

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
