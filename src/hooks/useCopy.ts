import { useState } from 'react';

export function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  return { copied, copy };
}
