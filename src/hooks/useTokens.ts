import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function useTokens() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getTokens();
        if (mounted) { 
          setData(res); 
          setLoading(false); 
          setError(null); 
        }
      } catch (e) {
        if (mounted) { 
          setError('Token data not available'); 
          setLoading(false); 
        }
      }
    }

    fetch();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}
