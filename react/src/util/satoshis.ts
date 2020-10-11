export const satoshisToBch = (satoshis: number): number =>
  +(satoshis / 100_000_000).toFixed(8);

export const bchToSatoshis = (bch: number): number =>
  Math.round(bch * 100_000_000);

export default {
  satoshisToBch,
  bchToSatoshis,
};
