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
    <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 font-body text-[13px] text-white/40">
      <span className="inline-flex items-center gap-1">
        Block <NumberScroller value={data.lastIndexedBlock} className="font-mono" />
      </span>
      <span className="text-white/20">·</span>
      <span>{formatNumber(data.fundedAccounts)} accounts</span>
      <span className="text-white/20">·</span>
      <span>{formatNumber(data.totalTransfers)} transfers</span>
      <span className="text-white/20">·</span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00D179] animate-pulse flex-shrink-0" />
        <span className="text-[#00D179]">Synced</span>
      </span>
    </div>
  );
}
