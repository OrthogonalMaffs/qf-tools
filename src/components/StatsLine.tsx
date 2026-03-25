import { useStats } from '../hooks/useStats';
import { NumberScroller } from './NumberScroller';
import { formatNumber } from '../utils/format';

export function StatsLine() {
  const { data, loading, error } = useStats();

  if (loading || error || !data) {
    return (
      <div className="text-center font-body text-[13px] text-white/40">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-center font-body text-[13px] text-white/40">
      <span className="inline-flex items-center gap-1">
        Block <NumberScroller value={data.lastIndexedBlock} className="font-mono-addr" />
      </span>
      <span className="mx-2">·</span>
      <span>{formatNumber(data.fundedAccounts)} accounts</span>
      <span className="mx-2">·</span>
      <span>{formatNumber(data.totalTransfers)} transfers</span>
      <span className="mx-2">·</span>
      <span className="inline-flex items-center gap-1">
        <span className="w-1 h-1 bg-[#00D179] rounded-full animate-pulse"></span>
        Synced
      </span>
    </div>
  );
}
