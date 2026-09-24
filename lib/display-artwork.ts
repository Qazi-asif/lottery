export const ARTWORK_PRICES = [100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000] as const;

export type ArtworkTicket = {
  gameNumber: string;
  priceCents: number;
  src: string;
};
