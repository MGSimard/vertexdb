/**
 * Thumbnail-sized Cover: "cover_small"
 * Card-sized Cover: "720p"
 * https://images.igdb.com/igdb/image/upload/t_${sizeName}/${image_id}.jpg
 */

export const coverPath = (sizeName: "cover_small" | "720p", image_id: string) => {
  return `https://images.igdb.com/igdb/image/upload/t_${sizeName}/${image_id}.jpg`;
};
