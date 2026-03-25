import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { BURN_ADDRESS, QFPAY_ROUTER } from '../config/constants';
import type { Transfer, BurnEvent } from '../types';

export function useBurns() {
  const [data, setData] = useState<BurnEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      try {
        const res = await api.getAddressTransfers(BURN_ADDRESS, 200);
        if (mounted) { 
          const burnEvents: BurnEvent[] = res.transfers.items
            .filter((tx: Transfer) => tx.to === BURN_ADDRESS)
            .map((tx: Transfer, index: number) => ({
              id: `burn-${index}`,
              source: tx.from === QFPAY_ROUTER ? 'qfpay' : 'qns',
              amount: parseFloat(tx.amountQF),
              triggerTx: tx.hash || 'unknown',
              triggerAccount: tx.from,
              block: tx.blockNumber,
              timestamp: new Date(tx.timestamp * 1000).toISOString(),
            }));
          
          setData(burnEvents); 
          setLoading(false); 
          setError(null); 
        }
      } catch (e) {
        if (mounted) { 
          setError('Failed to fetch burn data'); 
          setLoading(false); 
        }
      }
    }

    fetch();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}
