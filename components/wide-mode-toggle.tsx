'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function WideModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="w-full h-max min-h-8">
      <div className="m-auto h-max flex flex-row gap-1 border p-1 relative rounded-3xl w-max">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme('light')}
          className="border dark:border-0 rounded-full w-9 h-9"
        >
          <span>
            {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
            <Sun className="text-black/50 dark:text-white/60" />
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme('dark')}
          className="dark:border rounded-full w-9 h-9"
        >
          <span>
            {/* <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
            <Moon className="text-black/50 dark:text-white/60" />
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme('system')}
          className={`rounded-full w-9 h-9 ${theme === 'system' ? 'border border-[#d3d3d3]' : ''}`}
        >
          <Monitor className="text-black/50 dark:text-white/60" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
