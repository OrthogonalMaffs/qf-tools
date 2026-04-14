import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../config/constants';
import { parseQF } from '../utils/format';

export interface MigrationSummary {
  totalNativeQF: string;
  totalSupply: string;
  pctMigrated: string;
  claimCount: number;
  uniqueClaimants: number;
  latestBlock: number;
  latestTimestamp: string;
}

export interface MigrationClaim {
  blockNum: number;
  timestamp: string;
  ethAddress: string;
  who: string;
  whoName: string | null;
  whoAvatar: string | null;
  amountQF: string;
  isLarge: boolean;
}

interface ClaimsResponse {
  claims: MigrationClaim[];
  nextBefore: number | null;
}

export interface HistoryBucket {
  date: string;
  claims: number;
  nativeQF: string;
}

interface HistoryResponse {
  buckets: HistoryBucket[];
  startDate: string | null;
  endDate: string | null;
}

export interface DerivedSeries {
  labels: string[];
  cumulative: number[];
  velocity: number[];
  pace7: (number | null)[];
  raw: HistoryBucket[];
}

export interface TickerClaim extends MigrationClaim {
  isNew: boolean;
}

const SUMMARY_POLL_MS = 10_000;
const CLAIMS_POLL_MS = 10_000;
const IS_NEW_CLEAR_MS = 2_500;

export function useSummary() {
  const [data, setData] = useState<MigrationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetch(`${API_BASE}/migration/summary`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: MigrationSummary = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load summary');
      }
    }

    tick();
    const id = setInterval(tick, SUMMARY_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { data, error };
}

export function useClaims() {
  const [claims, setClaims] = useState<TickerClaim[]>([]);
  const [error, setError] = useState<string | null>(null);
  const headRef = useRef<number>(0);
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      try {
        const res = await fetch(`${API_BASE}/migration/claims?limit=20`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ClaimsResponse = await res.json();
        if (cancelled) return;

        setError(null);

        if (headRef.current === 0) {
          headRef.current = json.claims[0]?.blockNum ?? 0;
          setClaims(json.claims.map((c) => ({ ...c, isNew: false })));
          return;
        }

        const incoming = json.claims.filter((c) => c.blockNum > headRef.current);
        if (incoming.length === 0) return;

        headRef.current = incoming[0].blockNum;

        const flagged: TickerClaim[] = incoming.map((c) => ({ ...c, isNew: true }));
        setClaims((prev) => {
          const seen = new Set(prev.map((p) => p.blockNum));
          const deduped = flagged.filter((c) => !seen.has(c.blockNum));
          return [...deduped, ...prev].slice(0, 20);
        });

        for (const c of flagged) {
          const t = setTimeout(() => {
            setClaims((prev) =>
              prev.map((p) => (p.blockNum === c.blockNum ? { ...p, isNew: false } : p)),
            );
            timeoutsRef.current.delete(c.blockNum);
          }, IS_NEW_CLEAR_MS);
          timeoutsRef.current.set(c.blockNum, t);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load claims');
      }
    }

    tick();
    const id = setInterval(tick, CLAIMS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
      for (const t of timeoutsRef.current.values()) clearTimeout(t);
      timeoutsRef.current.clear();
    };
  }, []);

  return { claims, error };
}

export function useHistory() {
  const [data, setData] = useState<DerivedSeries | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/migration/history`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: HistoryResponse = await res.json();
        if (cancelled) return;

        const labels = json.buckets.map((b) => b.date);
        const velocity = json.buckets.map((b) => parseQF(b.nativeQF));

        const cumulative: number[] = [];
        let running = 0;
        for (const v of velocity) {
          running += v;
          cumulative.push(running);
        }

        const pace7: (number | null)[] = velocity.map((_, i) => {
          if (i < 6) return null;
          let sum = 0;
          for (let j = i - 6; j <= i; j++) sum += velocity[j];
          return sum / 7;
        });

        setData({ labels, cumulative, velocity, pace7, raw: json.buckets });
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load history');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error };
}
