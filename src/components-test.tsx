import { 
  GradientAvatar, 
  QFName, 
  TruncatedAddress, 
  Identity, 
  NumberScroller, 
  BurnBadge, 
  TransferRow, 
  EmptyState, 
  Skeleton, 
  StatsLine, 
  SearchBar 
} from './components';
import type { EnrichedTransfer } from './types';

// Mock transfer for testing
const mockTransfer: EnrichedTransfer = {
  blockNumber: 48306227,
  from: '5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm',
  fromName: 'alex.qf',
  to: '5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt',
  toName: 'axe.qf',
  amountQF: '1.00',
  amountWei: '1000000000000000000',
  timestamp: Math.floor(Date.now() / 1000) - 120,
  hash: null,
  isQFPayTransfer: true,
  burnAmount: 0.001,
};

export function ComponentsTest() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-content mx-auto space-y-12">
        <h1 className="text-3xl font-display font-bold text-white mb-8">Components Test</h1>
        
        {/* Avatar Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-white">Avatar & Identity</h2>
          <div className="flex items-center gap-4">
            <GradientAvatar address="5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm" size={24} />
            <GradientAvatar address="5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt" size={32} />
            <GradientAvatar address="5FbmtGERRpSCFG8Rz8bVGrUPW6y7q2xKCDv4EeRz8bVGrU" size={80} />
          </div>
          <div className="space-y-2">
            <Identity 
              address="5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm" 
              name="alex.qf" 
              showAvatar={true} 
              size={24} 
            />
            <Identity 
              address="5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt" 
              name="axe.qf" 
              showAvatar={true} 
              size={24} 
            />
            <Identity 
              address="5GaRaCrdTYRz8bVGrUPW6y7q2xKCDv4Ee22U2rgfRPm" 
              showAvatar={true} 
              size={24} 
            />
          </div>
        </section>

        {/* Name Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-white">Names & Addresses</h2>
          <div className="space-y-2">
            <QFName name="alex.qf" />
            <QFName name="hardwired.qf" />
            <TruncatedAddress address="5Ew9dLGRMLKCDv4EeRz8bVGrUPW6y7q2xT1KG1uKcNm" />
            <TruncatedAddress address="5DcouPSTvkCDv4EeRz8bVGrUPW6y7q2xVuFoKM73Rt" />
          </div>
        </section>

        {/* Number Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-white">Numbers & Badges</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-2">Number Scroller:</p>
              <NumberScroller value={48306227} className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-white/50 mb-2">Burn Badge:</p>
              <BurnBadge amount={0.001} />
            </div>
          </div>
        </section>

        {/* Transfer Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-white">Transfer Row</h2>
          <div className="bg-[#111111] rounded-lg p-4 max-w-2xl">
            <TransferRow transfer={mockTransfer} />
          </div>
        </section>

        {/* UI Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-white">UI Components</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/50 mb-2">Search Bar:</p>
              <SearchBar className="max-w-md" />
            </div>
            <div>
              <p className="text-sm text-white/50 mb-2">Stats Line:</p>
              <StatsLine />
            </div>
            <div>
              <p className="text-sm text-white/50 mb-2">Skeleton:</p>
              <div className="space-y-2 max-w-md">
                <Skeleton height="1rem" />
                <Skeleton height="1rem" width="80%" />
                <Skeleton height="1rem" width="60%" />
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-white">Empty State</h2>
          <div className="bg-[#111111] rounded-lg p-8 max-w-md">
            <EmptyState 
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              }
              title="No activity yet"
              description="This account hasn't made any transfers yet."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Make available for testing
if (typeof window !== 'undefined') {
  (window as any).ComponentsTest = ComponentsTest;
}
