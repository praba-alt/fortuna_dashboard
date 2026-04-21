export type Token = {
  liquidity_id: number;
  pool_address: string;
  state: number;
  pool_type: number | null;
  trust_score: number | null;
  contract_security_score: number | null;
  trading_safety_score: number | null;
  liquidity_distribution_score: number | null;
  transparency_score: number | null;
  launch_structure_score: number | null;
  social_sentiment_score: number | null;
  soft_cap: string | null;
  hard_cap: string | null;
  total_raised: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  tokens: {
    contract_address: string;
    name: string | null;
    symbol: string | null;
    logo_url?: string | null;
    chain_id: number;
  };
  currency: {
    symbol: string | null;
  } | null;
};

export type TokenListResponse = {
  tokens: Token[];
  filteredRecords: number;
};

export type DashboardStats = {
  totals: {
    totalPools: number;
    strong: number;
    medium: number;
    risky: number;
    live: number;
    ended: number;
    cancelled: number;
    upcoming: number;
    liveNow: number;
    noSocialActivity: number;
  };
  averages: {
    trust: number;
    contract: number;
    tokenomics: number;
    liquidity: number;
    teamKyc: number;
    fundraising: number;
    social: number;
  };
  chains: Array<{
    chainId: number;
    count: number;
  }>;
  poolTypes: Array<{
    poolType: number | null;
    count: number;
  }>;
};

export type Filters = {
  chain: string;
  saleType: string;
  status: string;
  score: string;
  search: string;
  sortBy: string;
  order: "asc" | "desc";
  page: string;
  pageSize: string;
};

export const DEFAULT_FILTERS: Filters = {
  chain: "",
  saleType: "",
  status: "",
  score: "0",
  search: "",
  sortBy: "created_at",
  order: "desc",
  page: "1",
  pageSize: "20"
};

export function riskBucket(score: number | null): "strong" | "medium" | "risky" {
  const s = Number(score ?? 0);
  if (s >= 60) return "strong";
  if (s >= 35) return "medium";
  return "risky";
}

export function deriveSaleStatus(
  state: number | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
): number {
  const normalized = state ?? 1;
  const now = Date.now();

  if (normalized === 0) {
    const startTs = startDate ? new Date(startDate).getTime() : Number.NaN;
    const endTs = endDate ? new Date(endDate).getTime() : Number.NaN;

    if (Number.isFinite(startTs) && startTs > now) return 3;
    if (Number.isFinite(endTs) && endTs < now) return 1;
  }

  return normalized === 0 || normalized === 1 || normalized === 2 || normalized === 3 ? normalized : 1;
}

export function saleStatusLabel(status: number): string {
  if (status === 0) return "Sale Live";
  if (status === 1) return "Ended";
  if (status === 2) return "Cancelled";
  if (status === 3) return "Upcoming";
  return "Ended";
}

export const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum Mainnet",
  10: "Optimism",
  25: "Cronos Mainnet",
  50: "XDC Network",
  56: "BNB Smart Chain",
  100: "Gnosis Chain",
  109: "Shibarium",
  130: "Unichain",
  137: "Polygon Mainnet",
  146: "Sonic",
  196: "X Layer Mainnet",
  199: "BitTorrent Chain",
  204: "opBNB",
  250: "Fantom Opera",
  252: "Fraxtal",
  324: "zkSync Era",
  369: "PulseChain",
  480: "World Chain",
  999: "HyperEVM",
  1111: "WEMIX",
  1116: "Core",
  1284: "Moonbeam",
  1285: "Moonriver",
  1923: "Swellchain",
  2000: "Dogechain",
  2741: "Abstract",
  3797: "Alvey",
  4352: "Memecore",
  5000: "Mantle",
  7000: "ZetaChain",
  42161: "Arbitrum",
  42170: "Arbitrum Nova",
  43114: "Avalanche C-Chain",
  50103: "Sui Testnet",
  50104: "Sui Mainnet",
  59144: "Linea",
  80094: "Berachain",
  81457: "Blast",
  167000: "Taiko",
  534351: "Scroll Sepolia Testnet",
  534352: "Scroll",
  660279: "Xai",
  747474: "Katana",
  501424: "Solana Mainnet",
  501423: "Solana Devnet",
  3254774: "Eclipse Mainnet",
  3254773: "Eclipse Devnet",
  8453: "Base Mainnet",
  33139: "ApeChain",
  17000: "Ethereum Hoodi",
  11155111: "Ethereum Sepolia",
  [-239]: "TON Mainnet",
  [-3]: "TON Testnet"
};
