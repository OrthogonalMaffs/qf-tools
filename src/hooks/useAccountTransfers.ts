import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { enrichTransfers } from '../utils/enrichTransfers';
import type { EnrichedTransfer } from '../types';

export function useAccountTransfers(addressOrName: string, limit = 50) {
  const [data, setData] = useState<EnrichedTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressOrName) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    async function fetchData() {
      try {
        const res = await api.getAddressTransfers(addressOrName, limit);
        if (mounted) {
          const enriched = enrichTransfers(res.transfers.items);
          setData(enriched);
          setLoading(false);
          setError(null);
        }
      } catch {
        if (mounted) {
          setError('Failed to fetch account transfers');
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [addressOrName, limit]);

  return { data, loading, error };
}
