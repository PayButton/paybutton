import { useEffect, useState } from 'react';

import { AddressDetails, getAddressDetails } from '../util/api-client';

const POLL_DELAY = 100;

export const useAddressDetails = (
  address: string,
  active = true,
): AddressDetails | undefined => {
  const [details, setDetails] = useState<AddressDetails>();

  useEffect(() => {
    if (!address || !active) {
      setDetails(undefined);
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
