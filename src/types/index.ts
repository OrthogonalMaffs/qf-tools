export interface StatsResponse {
  totalExtrinsics: number;
  totalTransfers: number;
  fundedAccounts: number;
  lastIndexedBlock: number;
}

export interface HealthResponse {
  status: string;
  timestamp: number;
}

export interface Account {
  address: string;
  h160: string;
  name: string | null;        // e.g. "axe.qf" or null
  freeQF: string;
  reservedQF: string;
  totalQF: string;
  nonce: number;
  lastSeen: number;
}

export interface AccountsResponse {
  count: number;
  accounts: Account[];
}

export interface Transfer {
  blockNumber: number;
  from: string;
  fromName: string | null;    // e.g. "bigbadbarry.qf" or null
  to: string;
  toName: string | null;
  amountWei: string;
  amountQF: string;
  timestamp: number;
  hash: string | null;
}

export interface Extrinsic {
  blockNumber: number;
  index: number;
  hash: string;
  signer: string;
  signerName: string | null;
  section: string;
  method: string;
  call: string;
  args: string[];
  success: boolean;
  timestamp: number;
}

export interface TransfersResponse {
  transfers: { count: number; items: Transfer[] };
  extrinsics: { count: number; items: Extrinsic[] };
}

export interface AccountDetailResponse {
  address: string;
  found: boolean;
  balance: Account;
}

export interface AddressTransfersResponse extends TransfersResponse {
  address: string;
  addressName: string | null;
}

export interface EnrichedTransfer extends Transfer {
  isQFPayTransfer: boolean;
  burnAmount?: number;
  originalSender?: string;
  originalSenderName?: string | null;
}

export interface Token {
  name: string;
  symbol: string;
  contractAddress: string;
  deployer: string;       // address — resolve to .qf name if available
  totalSupply: string;
  verified: boolean;
}

export interface GasDataPoint {
  timestamp: string;
  price: number; // in micro-QF
}

export interface BurnEvent {
  id: string;
  source: 'qfpay' | 'qns';
  amount: number;
  triggerTx: string;       // transfer id or "QNS registration"
  triggerAccount: string;  // address
  block: number;
  timestamp: string;
}
