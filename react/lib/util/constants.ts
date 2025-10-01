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