import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { AccountDetailResponse } from '../types';

export function useAccount(addressOrName: string) {
  const [data, setData] = useState<AccountDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressOrName) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getAccount(addressOrName);
        if (mounted) { 
          setData(res); 
          setLoading(false); 
          setError(null); 
        }
      } catch (e) {
        if (mounted) { 
          setError('Account not found'); 
          setLoading(false); 
        }
      }
    }

    fetch();
    return () => { mounted = false; };
  }, [addressOrName]);

  return { data, loading, error };
}
