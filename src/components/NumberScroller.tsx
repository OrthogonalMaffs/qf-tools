import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumberScrollerProps {
  value: number;
  className?: string;
}

export function NumberScroller({ value, className = '' }: NumberScrollerProps) {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setDisplayValue(value.toString());
      setPrevValue(value);
    }
  }, [value, prevValue]);

  const digits = displayValue.split('').map((digit, index) => {
    const prevDigit = prevValue.toString()[index];
    const isChanging = digit !== prevDigit && prevDigit !== undefined;
    
    return (
      <div key={index} className="relative inline-block">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${digit}-${index}`}
            initial={{ y: isChanging ? -20 : 0, opacity: isChanging ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className="inline-block"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  });

  return (
    <div className={`font-mono font-mono-addr ${className}`}>
      {digits}
    </div>
  );
}
