interface TokenDetails {
    network: {
        contractAddress: string;
    };
    decimals: number;
    depositOffline?: string[] | boolean;
    settleOffline?: string[] | boolean;
}

interface Coin {
    networks: string[];
    coin: string;
    name: string;
    hasMemo: boolean;
    fixedOnly: string[] | boolean;
    variableOnly: string[] | boolean;
    tokenDetails: TokenDetails[];
}

export async function getCoins(): Promise<Coin[]> {
  const res = await fetch('https://sideshift.ai/api/v2/coins')
  const data = await res.json()
  return data as Coin[]
}
