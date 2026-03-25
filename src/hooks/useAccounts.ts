import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { AccountsResponse } from '../types';

export function useAccounts(limit = 200, pollInterval = 60_000) {
  const [data, setData] = useState<AccountsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getAccounts(limit);
        if (mounted) { 
          setData(res); 
          setLoading(false); 
          setError(null); 
        }
      } catch (e) {
        if (mounted) { 
          setError('Failed to fetch accounts'); 
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
