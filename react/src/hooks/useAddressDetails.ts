import { useEffect, useState } from 'react';

import { Transaction, getAddressDetails } from '../util/api-client';
import { isValidCashAddress, isValidXecAddress } from '../util/address';

const POLL_DELAY = 1000;

export const useAddressDetails = (
  address: string,
  active = true,
): Transaction[] | undefined => {
  const [details, setDetails] = useState<Transaction[]>();

  useEffect(() => {
    if (!address || !active) {
      setDetails(undefined);
      return;
    }
    if (!isValidCashAddress(address) && !isValidXecAddress(address)) {
      return;
    }

    let timer = window.setTimeout(poll, 0);
    let cancelled = false;

    async function poll(): Promise<void> {
      try {
        const newDetails = await getAddressDetails(address);
        setDetails(details => {
          if (JSON.stringify(details) === JSON.stringify(newDetails))
            return details;
          return newDetails;
        });
      } catch {}

      if (!cancelled) timer = window.setTimeout(poll, POLL_DELAY);
    }

    return (): void => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [address, active]);

  return details;
};

export default useAddressDetails;
