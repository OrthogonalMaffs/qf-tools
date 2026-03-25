import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import type { StatsResponse } from '../types';

export function useStats(pollInterval = 30_000) {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getStats();
        if (mounted) { 
          setData(res); 
          setLoading(false); 
          setError(null); 
        }
      } catch (e) {
        if (mounted) { 
          setError('Failed to fetch'); 
          setLoading(false); 
        }
      }
    }

    fetch();
    const id = setInterval(fetch, pollInterval);
    return () => { mounted = false; clearInterval(id); };
  }, [pollInterval]);

  return { data, loading, error };
}
