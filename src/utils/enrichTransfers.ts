import { BURN_ADDRESS, QFPAY_ROUTER } from '../config/constants';
import type { Transfer, EnrichedTransfer } from '../types';

export function enrichTransfers(transfers: Transfer[]): EnrichedTransfer[] {
  const byBlock = new Map<number, Transfer[]>();
  for (const tx of transfers) {
    const list = byBlock.get(tx.blockNumber) || [];
    list.push(tx);
    byBlock.set(tx.blockNumber, list);
  }

  const enriched: EnrichedTransfer[] = [];
  const consumed = new Set<number>(); // index in original array

  for (let i = 0; i < transfers.length; i++) {
    if (consumed.has(i)) continue;
    const tx = transfers[i];

    // Is this a delivery FROM a router-like address (not to burn)?
    if (tx.to !== BURN_ADDRESS) {
      // Find a burn in the same block from the same sender
      const burnIdx = transfers.findIndex(
        (t, j) =>
          j !== i &&
          !consumed.has(j) &&
          t.blockNumber === tx.blockNumber &&
          t.from === tx.from &&
          t.to === BURN_ADDRESS
      );

      if (burnIdx !== -1) {
        const burnTx = transfers[burnIdx];
        // Find the user→router transfer in same block
        const senderIdx = transfers.findIndex(
          (t, j) =>
            j !== i &&
            j !== burnIdx &&
            !consumed.has(j) &&
            t.blockNumber === tx.blockNumber &&
            t.to === tx.from
        );

        consumed.add(i);
        consumed.add(burnIdx);
        if (senderIdx !== -1) consumed.add(senderIdx);

        const senderTx = senderIdx !== -1 ? transfers[senderIdx] : null;

        enriched.push({
          ...tx,
          from: senderTx?.from || tx.from,
          fromName: senderTx?.fromName || tx.fromName,
          isQFPayTransfer: true,
          burnAmount: parseFloat(burnTx.amountQF),
          originalSender: senderTx?.from,
          originalSenderName: senderTx?.fromName,
        });
        continue;
      }
    }

    // Is this a burn transfer or user→router that should already be consumed?
    if (tx.to === BURN_ADDRESS || tx.to === QFPAY_ROUTER) {
      const hasDelivery = transfers.some(
        (t, j) =>
          j !== i &&
          t.blockNumber === tx.blockNumber &&
          t.from === (tx.to === BURN_ADDRESS ? tx.from : tx.to) &&
          t.to !== BURN_ADDRESS &&
          t.from !== tx.from
      );
      if (hasDelivery) {
        consumed.add(i);
        continue;
      }
    }

    // Regular transfer
    enriched.push({ ...tx, isQFPayTransfer: false });
  }

  return enriched;
}
