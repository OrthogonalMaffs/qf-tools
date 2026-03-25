import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { GradientAvatar } from './GradientAvatar';
import { formatQF, relativeTime } from '../utils/format';
import type { BurnEvent } from '../types';

interface ProtocolStyle {
  label: string;
  color: string;
  bg: string;
}

interface Props {
  burn: BurnEvent | null;
  protocol: ProtocolStyle | null;
  onClose: () => void;
}

export function BurnDetailModal({ burn, protocol, onClose }: Props) {
  useEffect(() => {
    if (!burn) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [burn, onClose]);

  return (
    <AnimatePresence>
      {burn && protocol && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-[360px] bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-6 pointer-events-auto shadow-[0_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* Burn amount */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#E85D25]/10 flex items-center justify-center flex-shrink-0">
                  <Flame size={20} className="text-[#E85D25]" />
                </div>
                <div>
                  <div className="font-body font-semibold text-[20px] text-white">
                    {formatQF(burn.amount)} <span className="text-white/40 font-normal text-sm">QF</span>
                  </div>
                  <div className="font-body text-xs text-white/30 mt-0.5">burned forever</div>
                </div>
              </div>

              {/* Protocol */}
              <div className="mb-5">
                <div className="font-body text-[11px] text-white/30 uppercase tracking-wider mb-1.5">Protocol</div>
                <span
                  className="font-body text-xs font-medium px-3 py-1 rounded-full inline-block"
                  style={{ color: protocol.color, backgroundColor: protocol.bg }}
                >
                  {protocol.label}
                </span>
              </div>

              {/* Triggered by */}
              {burn.triggerAccount && (
                <div className="mb-5">
                  <div className="font-body text-[11px] text-white/30 uppercase tracking-wider mb-1.5">Triggered by</div>
                  <Link
                    to={`/explorer/${burn.triggerAccount}`}
                    onClick={onClose}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  >
                    <GradientAvatar address={burn.triggerAccount} size={28} className="flex-shrink-0" />
                    <span className="font-mono text-sm text-white/50 truncate">
                      {burn.triggerAccount}
                    </span>
                  </Link>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-white/[0.05] font-body text-xs text-white/25">
                Block {burn.block} · {relativeTime(Math.floor(new Date(burn.timestamp).getTime() / 1000))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
