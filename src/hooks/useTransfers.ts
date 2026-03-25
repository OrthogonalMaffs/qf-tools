import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { enrichTransfers } from '../utils/enrichTransfers';
import type { TransfersResponse, EnrichedTransfer } from '../types';

export function useTransfers(limit = 100, pollInterval = 60_000) {
  const [data, setData] = useState<EnrichedTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getTransfers(limit);
        if (mounted) { 
          const enriched = enrichTransfers(res.transfers.items);
          setData(enriched); 
          setLoading(false); 
          setError(null); 
        }
      } catch (e) {
        if (mounted) { 
          setError('Failed to fetch transfers'); 
          setLoading(false); 
        }
      }
    }

    fetch();
    const id = setInterval(fetch, pollInterval);
    return () => { mounted = false; clearInterval(id); };
  }, [limit, pollInterval]);

  return { data, loading, error };
}
