import { API_BASE } from '../config/constants';
import type {
  StatsResponse,
  HealthResponse,
  AccountsResponse,
  TransfersResponse,
  AccountDetailResponse,
  AddressTransfersResponse,
} from '../types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getStats(): Promise<StatsResponse> {
    return this.fetch<StatsResponse>('/stats');
  }

  async getHealth(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/health');
  }

  async getAccounts(limit = 200): Promise<AccountsResponse> {
    return this.fetch<AccountsResponse>(`/accounts?limit=${limit}`);
  }

  async getTransfers(limit = 100): Promise<TransfersResponse> {
    return this.fetch<TransfersResponse>(`/txs?limit=${limit}`);
  }

  async getAccount(addressOrName: string): Promise<AccountDetailResponse> {
    return this.fetch<AccountDetailResponse>(`/account/${encodeURIComponent(addressOrName)}`);
  }

  async getAddressTransfers(addressOrName: string, limit = 100): Promise<AddressTransfersResponse> {
    return this.fetch<AddressTransfersResponse>(`/txs/${encodeURIComponent(addressOrName)}?limit=${limit}`);
  }

  async getGas(): Promise<any> {
    // Currently returns error, handle gracefully
    try {
      return this.fetch<any>('/gas');
    } catch {
      return null;
    }
  }

  async getTokens(): Promise<any> {
    // Currently returns error, handle gracefully
    try {
      return this.fetch<any>('/tokens');
    } catch {
      return null;
    }
  }
}

export const api = new ApiClient(API_BASE);
