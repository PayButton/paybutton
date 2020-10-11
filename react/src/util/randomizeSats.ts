export const randomizeSatoshis = (amount: number): number => {
  const date = new Date();

  // 0-99: 10 second window, resets every 16.5 minutes
  const window =
    Math.floor((date.getUTCMinutes() * 60 + date.getUTCSeconds()) / 10) % 90;
  // 0-99: random
  const random = Math.floor(Math.random() * 100);

  const randomizedAmount =
    Math.max(0, +amount.toFixed(4)) + // zero out the 4 least-significant digits
    random * 1e-6 + // Two random digits
    window * 1e-8; // Two digits for the time window
  return +randomizedAmount.toFixed(8);
};

export default randomizeSatoshis;
