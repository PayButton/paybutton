const BASE_SIDESHIFT_URL='https://sideshift.ai/api/v2/'

interface TokenDetails {
  [network: string]: {
    contractAddress: string;
    decimals: number;
  }
}

export interface Coin {
    networks: string[];
    coin: string;
    name: string;
    hasMemo: boolean;
    fixedOnly: string[] | boolean;
    variableOnly: string[] | boolean;
    tokenDetails: TokenDetails;
    depositOffline?: string[] | boolean;
    settleOffline?: string[] | boolean;
}

export async function getCoins(originCoin: string): Promise<Coin[]> {
  const res = await fetch(BASE_SIDESHIFT_URL + 'coins')
  const data = await res.json()

  const coins = data as Coin[]
  coins.sort((a, b) => a.name < b.name ? -1 : 1)
  return coins.filter(coin => coin.coin.toLowerCase() !== originCoin.toLowerCase())
}

export interface Pair {
  min: string;
  max: string;
  rate: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
}

async function getPair(from: string, to: string): Promise<Pair> {
  const res = await fetch(BASE_SIDESHIFT_URL + `pair/${from}/${to}`)
  const data = await res.json()
  return data as Pair
}

export async function getXecPair(from: string): Promise<Pair> {
  return getPair(from, 'ecash-xec')
}
