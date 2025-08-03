import { 
  CashtabConnect, 
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
  CashtabTimeoutError 
} from 'cashtab-connect';

// Create a single instance to be reused throughout the app
const cashtab = new CashtabConnect();

/**
 * Check if the Cashtab extension is available
 * @returns Promise<boolean> - true if extension is available, false otherwise
 */
export const getCashtabProviderStatus = async (): Promise<boolean> => {
  try {
    return await cashtab.isExtensionAvailable();
  } catch (error) {
    return false;
  }
};

/**
 * Wait for the Cashtab extension to become available
 * @param timeout - Maximum time to wait in milliseconds (default: 3000)
 * @returns Promise that resolves when extension is available or rejects on timeout
 */
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

/**
 * Send XEC to an address using Cashtab
 * @param address - Recipient's eCash address
 * @param amount - Amount to send in XEC
 * @throws {CashtabExtensionUnavailableError} When the Cashtab extension is not available
 */
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
      // For BIP21 URLs, we need to parse them to extract address and amount
      // The cashtab-connect library expects separate address and amount parameters
      const url = new URL(bip21Url);
      const address = url.pathname;
      const amount = url.searchParams.get('amount');
      
      if (amount) {
        // If we have an amount, use the sendXec method
        await sendXecWithCashtab(address, amount);
      } else {
        // If no amount, fall back to opening web Cashtab with the full BIP21 URL
        const webUrl = fallbackUrl || `https://cashtab.com/#/send?bip21=${encodeURIComponent(bip21Url)}`;
        window.open(webUrl, '_blank');
      }
    } else {
      // Extension not available, open web Cashtab
      const webUrl = fallbackUrl || `https://cashtab.com/#/send?bip21=${encodeURIComponent(bip21Url)}`;
      window.open(webUrl, '_blank');
    }
  } catch (error) {
    console.warn('Cashtab payment failed, falling back to web interface:', error);
    // If extension interaction fails, fall back to web Cashtab
    const webUrl = fallbackUrl || `https://cashtab.com/#/send?bip21=${encodeURIComponent(bip21Url)}`;
    window.open(webUrl, '_blank');
  }
};

// Export error types for consumers to handle specific errors
export {
  CashtabExtensionUnavailableError,
  CashtabAddressDeniedError,
  CashtabTimeoutError
};
