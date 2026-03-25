import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const metaMatch = !!shortcut.metaKey === event.metaKey;
        const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
        const altMatch = !!shortcut.altKey === event.altKey;
        const shiftMatch = !!shortcut.shiftKey === event.shiftKey;

        if (keyMatch && metaMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return { searchInputRef };
}

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      metaKey: true,
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Search',
    },
    {
      key: '/',
      action: () => {
        // Focus search input
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Search',
    },
    {
      key: 'g',
      action: () => navigate('/explorer'),
      description: 'Go to Explorer',
    },
    {
      key: 't',
      action: () => navigate('/tokens'),
      description: 'Go to Tokens',
    },
    {
      key: 'a',
      action: () => navigate('/accounts'),
      description: 'Go to Accounts',
    },
    {
      key: 'b',
      action: () => navigate('/burn'),
      description: 'Go to Burn',
    },
    {
      key: 's',
      action: () => navigate('/gas'),
      description: 'Go to Gas',
    },
  ];

  return useKeyboardShortcuts(shortcuts);
}
