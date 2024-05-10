
export * from './address';
export * from './api-client';
export * from './constants';
export * from './format';
export * from './opReturn';
export * from './randomizeSats';
export * from './satoshis';
export * from './socket';
export * from './types';
export * from './number';
export * from './currency';


export const getCashtabProviderStatus = () => {
  const windowAny = window as any;
  if (window && windowAny.bitcoinAbc && windowAny.bitcoinAbc === 'cashtab') {
    return true;
  }
  return false;
};
