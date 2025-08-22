import { 
  CashtabConnect, 
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
  CashtabTimeoutError 
} from 'cashtab-connect';

const cashtab = new CashtabConnect();

// Cache for extension status to avoid multiple checks
let extensionStatusCache: boolean | null = null;
let extensionStatusPromise: Promise<boolean> | null = null;

/**
 * Check if the Cashtab extension is available (with caching)
 * This function caches the result to avoid multiple extension checks per page load
 * @returns Promise<boolean> - true if extension is available, false otherwise
 */
export const getCashtabProviderStatus = async (): Promise<boolean> => {
  // Return cached result if available
  if (extensionStatusCache !== null) {
    return extensionStatusCache;
  }

  // If a check is already in progress, wait for it
  if (extensionStatusPromise !== null) {
    return extensionStatusPromise;
  }

  extensionStatusPromise = (async () => {
    try {
      const isAvailable = await cashtab.isExtensionAvailable();
      extensionStatusCache = isAvailable;
      return isAvailable;
    } catch (error) {
      extensionStatusCache = false;
      return false;
    } finally {
      // Clear the promise so future calls can make a fresh check if needed
      extensionStatusPromise = null;
    }
  })();

  return extensionStatusPromise;
};

/**
 * Clear the cached extension status (useful for testing or if extension state changes)
 */
export const clearCashtabStatusCache = (): void => {
  extensionStatusCache = null;
  extensionStatusPromise = null;
};


export const initializeCashtabStatus = async (): Promise<boolean> => {
  return getCashtabProviderStatus();
};

export const waitForCashtabExtension = async (timeout?: number): Promise<void> => {
  return cashtab.waitForExtension(timeout);
};

/**
 * Request the user's eCash address from their Cashtab wallet
 * @returns Promise<string> - The user's address
 * @throws {CashtabExtensionUnavailableError} When the Cashtab extension is not available
 * @throws {CashtabAddressDeniedError} When the user denies the address request
 * @throws {CashtabTimeoutError} When the request times out
 */
export const requestCashtabAddress = async (): Promise<string> => {
  return cashtab.requestAddress();
};

export const sendXecWithCashtab = async (address: string, amount: string | number): Promise<any> => {
  return cashtab.sendXec(address, amount);
};

/**
 * Open Cashtab with a BIP21 payment URL
 * @param bip21Url - The BIP21 formatted payment URL
 * @param fallbackUrl - Optional fallback URL if extension is not available
 */
export const openCashtabPayment = async (bip21Url: string, fallbackUrl?: string): Promise<void> => {
  try {
    const isAvailable = await getCashtabProviderStatus();
    
    if (isAvailable) {
      cashtab.sendBip21(bip21Url);
    } else {
      const webUrl = fallbackUrl || `https://cashtab.com/#/send?bip21=${encodeURIComponent(bip21Url)}`;
      window.open(webUrl, '_blank');
    }
  } catch (error) {
    if (error instanceof CashtabAddressDeniedError) {
      // User rejected the transaction - do nothing for now
      // This case is handled here in case we want to add specific behavior in the future
      return;
    }
    
    const webUrl = fallbackUrl || `https://cashtab.com/#/send?bip21=${encodeURIComponent(bip21Url)}`;
    window.open(webUrl, '_blank');
  }
};

export {
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
  CashtabTimeoutError
};
