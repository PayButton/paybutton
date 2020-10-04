export const amount = (x?: number | null): string | undefined =>
  x
    ?.toFixed(8)
    .replace(/\.0*$/, '')
    .replace(/(\.\d*?)0*$/, '$1');

export default {
  amount,
};
