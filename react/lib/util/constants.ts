export const FIAT_CURRENCIES = ['USD', 'CAD'];

export const CRYPTO_CURRENCIES = ['BCH', 'XEC'];

export const DECIMALS: { [key: string]: number } = {
    BCH: 8,
    XEC: 2,
    FIAT: 2,
};

// Default delay (ms) before auto-closing success dialog when autoClose is enabled
export const AUTO_CLOSE_DEFAULT_MS = 2000;

export const CURRENCY_PREFIXES_MAP: Record<typeof CRYPTO_CURRENCIES[number], string> = {
    bch: 'bitcoincash',
    xec: 'ecash',
};

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | "extrasmall" | "small" | "medium" | "large" | "extralarge" | undefined;

export const DEFAULT_DONATE_RATE = 2;

export const DEFAULT_MINIMUM_DONATE_AMOUNT = 10;

export const DONATION_RATE_STORAGE_KEY = 'paybutton_donation_rate'
