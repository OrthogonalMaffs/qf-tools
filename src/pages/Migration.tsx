import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSummary, useClaims, useHistory } from '../hooks/useMigration';
import type { DerivedSeries, TickerClaim } from '../hooks/useMigration';
import { Skeleton } from '../components';
import { parseQF, formatNumber, truncateAddress, relativeTime } from '../utils/format';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const PURPLE = '#7F77DD';
const TEAL = '#1D9E75';
const AMBER = '#EF9F27';
const CARD_OUTER = '#0e0e0e';
const CARD_INNER = '#1a1a1a';

type Tab = 'cumulative' | 'velocity' | 'pace7';

function compact(n: number): string {
  if (!Number.isFinite(n)) return '0';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function formatSignedCompact(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${compact(n)}`;
}

function formatSignedPct(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

function initialFor(name: string): string {
  const ch = name.trim().charAt(0);
  return ch ? ch.toUpperCase() : '?';
}

export function Migration() {
  useDocumentTitle('QFTools — Migration Tracker');
  const { data: summary } = useSummary();
  const { claims } = useClaims();
  const { data: history } = useHistory();
  const [tab, setTab] = useState<Tab>('cumulative');

  const weekDeltas = useMemo(() => {
    if (!history) return null;
    const v = history.velocity;
    if (v.length < 14) return { last7: 0, prior7: 0, delta: 0, pct: 0, avgDay: v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0 };
    const n = v.length;
    const last7 = v.slice(n - 7).reduce((a, b) => a + b, 0);
    const prior7 = v.slice(n - 14, n - 7).reduce((a, b) => a + b, 0);
    const delta = last7 - prior7;
    const pct = prior7 > 0 ? (delta / prior7) * 100 : 0;
    const avgDay = last7 / 7;
    return { last7, prior7, delta, pct, avgDay };
  }, [history]);

  return (
    <div className="max-w-[920px] mx-auto">
      <Hero summary={summary} weekDeltas={weekDeltas} />
      <StatCards summary={summary} weekDeltas={weekDeltas} />
      <ChartCard history={history} tab={tab} onTab={setTab} />
      <Ticker claims={claims} />
    </div>
  );
}

function Hero({
  summary,
  weekDeltas,
}: {
  summary: ReturnType<typeof useSummary>['data'];
  weekDeltas: { last7: number; prior7: number; delta: number; pct: number; avgDay: number } | null;
}) {
  const total = summary ? parseQF(summary.totalNativeQF) : 0;
  const supply = summary ? parseQF(summary.totalSupply) : 0;
  const pct = summary ? parseQF(summary.pctMigrated) * 100 : 0;

  return (
    <div
      className="rounded-2xl p-8 md:p-10 mb-6"
      style={{ backgroundColor: CARD_OUTER, border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {!summary ? (
        <div className="flex flex-col gap-3">
          <Skeleton width={280} height={52} className="rounded-lg" />
          <Skeleton width={320} height={16} className="rounded" />
          <Skeleton width="100%" height={6} className="rounded-full mt-3" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <div className="font-display font-bold text-[44px] md:text-[56px] text-white leading-none">
              {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="font-body text-white/40 text-lg">QF claimed</div>
          </div>
          <div className="mt-3 font-body text-sm text-white/50">
            of{' '}
            <span className="font-mono text-white/70">
              {supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>{' '}
            native supply · <span style={{ color: PURPLE }}>{pct.toFixed(2)}%</span> migrated
          </div>

          <div className="mt-5 h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
              style={{ backgroundColor: PURPLE }}
            />
          </div>

          {weekDeltas && (
            <div className="mt-5 font-body text-xs text-white/40">
              Last 7 days:{' '}
              <span
                className="font-mono"
                style={{ color: weekDeltas.delta >= 0 ? TEAL : AMBER }}
              >
                {formatSignedCompact(weekDeltas.delta)} QF
              </span>{' '}
              vs prior week
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCards({
  summary,
  weekDeltas,
}: {
  summary: ReturnType<typeof useSummary>['data'];
  weekDeltas: { last7: number; prior7: number; delta: number; pct: number; avgDay: number } | null;
}) {
  const remaining = summary ? parseQF(summary.totalSupply) - parseQF(summary.totalNativeQF) : 0;
  const wallets = summary?.uniqueClaimants ?? 0;
  const avgDay = weekDeltas?.avgDay ?? 0;
  const weekPct = weekDeltas?.pct ?? 0;

  const cards: { label: string; value: string; accent?: string }[] = [
    { label: 'Remaining', value: summary ? `${compact(remaining)} QF` : '—' },
    { label: 'Wallets migrated', value: summary ? wallets.toLocaleString() : '—' },
    { label: 'Avg QF / day (7d)', value: weekDeltas ? `${compact(avgDay)} QF` : '—' },
    {
      label: 'Week on week',
      value: weekDeltas ? formatSignedPct(weekPct) : '—',
      accent: weekDeltas ? (weekPct >= 0 ? TEAL : AMBER) : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl p-4"
          style={{ backgroundColor: CARD_INNER, border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="font-body text-[11px] text-white/40 uppercase tracking-wider mb-2">
            {c.label}
          </div>
          <div
            className="font-mono text-[20px] text-white"
            style={c.accent ? { color: c.accent } : undefined}
          >
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  history,
  tab,
  onTab,
}: {
  history: DerivedSeries | null;
  tab: Tab;
  onTab: (t: Tab) => void;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'cumulative', label: 'Cumulative' },
    { id: 'velocity', label: 'Daily velocity' },
    { id: 'pace7', label: '7-day pace' },
  ];

  return (
    <div
      className="rounded-2xl p-5 md:p-6 mb-6"
      style={{ backgroundColor: CARD_OUTER, border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {tabs.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className="font-body text-[12px] px-3 py-1.5 rounded-lg transition-colors duration-150"
              style={{
                backgroundColor: active ? CARD_INNER : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                border: active ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {!history ? (
        <Skeleton width="100%" height={240} className="rounded-lg" />
      ) : (
        <Chart history={history} tab={tab} />
      )}
    </div>
  );
}

function Chart({ history, tab }: { history: DerivedSeries; tab: Tab }) {
  const W = 800;
  const H = 240;
  const padL = 56;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const { labels, cumulative, velocity, pace7 } = history;
  const n = labels.length;

  const series: (number | null)[] = tab === 'cumulative' ? cumulative : tab === 'velocity' ? velocity : pace7;
  const valid = series.filter((v): v is number => v !== null);
  const maxV = Math.max(1, ...valid);
  const xFor = (i: number) => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yFor = (v: number) => padT + innerH - (v / maxV) * innerH;

  const gridSteps = 4;
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, k) => {
    const v = (maxV * k) / gridSteps;
    return { y: yFor(v), label: compact(v) };
  });

  const xTicks = useMemo(() => {
    if (n === 0) return [] as { i: number; label: string }[];
    if (n === 1) return [{ i: 0, label: labels[0].slice(5) }];
    const mid = Math.floor((n - 1) / 2);
    return [
      { i: 0, label: labels[0].slice(5) },
      { i: mid, label: labels[mid].slice(5) },
      { i: n - 1, label: labels[n - 1].slice(5) },
    ];
  }, [labels, n]);

  const linePoints = series
    .map((v, i) => (v === null ? null : `${xFor(i)},${yFor(v)}`))
    .filter((p): p is string => p !== null);
  const linePath = linePoints.length ? `M ${linePoints.join(' L ')}` : '';

  const firstIdx = series.findIndex((v) => v !== null);
  const lastIdx = (() => {
    for (let i = series.length - 1; i >= 0; i--) if (series[i] !== null) return i;
    return -1;
  })();
  const areaPath =
    linePoints.length > 1 && firstIdx !== -1 && lastIdx !== -1
      ? `${linePath} L ${xFor(lastIdx)},${yFor(0)} L ${xFor(firstIdx)},${yFor(0)} Z`
      : '';

  const barW = n > 0 ? Math.max(2, (innerW / n) * 0.75) : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full h-[240px] block"
      role="img"
      aria-label={`${tab} chart`}
    >
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={padL}
            x2={W - padR}
            y1={g.y}
            y2={g.y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
          <text
            x={padL - 8}
            y={g.y + 3}
            fontSize={10}
            textAnchor="end"
            fill="rgba(255,255,255,0.3)"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {g.label}
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <text
          key={t.i}
          x={xFor(t.i)}
          y={H - 8}
          fontSize={10}
          textAnchor={t.i === 0 ? 'start' : t.i === n - 1 ? 'end' : 'middle'}
          fill="rgba(255,255,255,0.3)"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {t.label}
        </text>
      ))}

      <defs>
        <linearGradient id="migArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={PURPLE} stopOpacity={0.35} />
          <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
        </linearGradient>
      </defs>

      {tab === 'velocity' ? (
        <g key={`bars-${tab}`}>
          {series.map((v, i) => {
            if (v === null || v === 0) return null;
            const x = xFor(i) - barW / 2;
            const y = yFor(v);
            const h = padT + innerH - y;
            return (
              <motion.rect
                key={i}
                x={x}
                width={barW}
                initial={{ y: padT + innerH, height: 0 }}
                animate={{ y, height: h }}
                transition={{ duration: 0.4, delay: i * 0.01, ease: [0.25, 0.1, 0.25, 1] }}
                fill={PURPLE}
                rx={1}
              />
            );
          })}
        </g>
      ) : (
        <g key={`line-${tab}`}>
          {areaPath && <path d={areaPath} fill="url(#migArea)" />}
          {linePath && (
            <motion.path
              d={linePath}
              fill="none"
              stroke={PURPLE}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
            />
          )}
        </g>
      )}
    </svg>
  );
}

function Ticker({ claims }: { claims: TickerClaim[] }) {
  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{ backgroundColor: CARD_OUTER, border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-semibold text-white text-[16px]">Recent claims</div>
        <div className="font-body text-[11px] text-white/30">live</div>
      </div>

      {claims.length === 0 ? (
        <div className="h-[180px] flex items-center justify-center">
          <div className="font-body text-sm text-white/30">Waiting for claims…</div>
        </div>
      ) : (
        <div className="h-[180px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {claims.map((c) => (
              <motion.div
                key={c.blockNum}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  backgroundColor: c.isNew ? CARD_INNER : 'rgba(0,0,0,0)',
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-3 py-2 px-2 rounded-lg"
              >
                <ClaimAvatar claim={c} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    {c.whoName ? (
                      <Link
                        to={`/explorer/${c.whoName}`}
                        className="font-body text-[13px] text-white truncate hover:underline"
                      >
                        {c.whoName}
                      </Link>
                    ) : (
                      <Link
                        to={`/explorer/${c.who}`}
                        className="font-mono text-[12px] text-white/80 truncate hover:underline"
                      >
                        {truncateAddress(c.who, true)}
                      </Link>
                    )}
                    <a
                      href={`https://etherscan.io/address/${c.ethAddress}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-white/30 hover:text-white/60 truncate"
                    >
                      ← {truncateAddress(c.ethAddress, true)}
                    </a>
                  </div>
                  <div className="font-body text-[11px] text-white/30 mt-0.5">
                    Block {formatNumber(c.blockNum)} · {relativeTime(Math.floor(new Date(c.timestamp).getTime() / 1000))}
                  </div>
                </div>
                <div
                  className="font-mono text-[14px] whitespace-nowrap"
                  style={{ color: c.isLarge ? PURPLE : 'rgba(255,255,255,0.85)' }}
                >
                  {parseQF(c.amountQF).toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                  <span className="text-white/30">QF</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ClaimAvatar({ claim }: { claim: TickerClaim }) {
  const display = claim.whoName ?? claim.who;
  if (claim.whoAvatar) {
    return (
      <img
        src={claim.whoAvatar}
        alt=""
        className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
      />
    );
  }
  return (
    <div
      className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[10px]"
      style={{ backgroundColor: CARD_INNER, color: 'rgba(255,255,255,0.6)' }}
    >
      {initialFor(display)}
    </div>
  );
}
