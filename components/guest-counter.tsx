'use client';

import * as React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

type GuestCounterProps = {
  value: { adults: number; children: number };
  onChange: (value: { adults: number; children: number }) => void;
};

export function GuestCounter({ value, onChange }: GuestCounterProps) {
  const { t } = useLanguage();

  const updateAdults = (newAdults: number) => {
    onChange({ ...value, adults: newAdults });
  };

  const updateChildren = (newChildren: number) => {
    onChange({ ...value, children: newChildren });
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('home.search.adults')}</span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateAdults(Math.max(1, value.adults - 1))}
            disabled={value.adults <= 1}
          >
            <MinusIcon className="h-3 w-3" />
            <span className="sr-only">Decrease adults</span>
          </Button>
          <span className="w-8 text-center">{value.adults}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateAdults(Math.min(10, value.adults + 1))}
            disabled={value.adults >= 10}
          >
            <PlusIcon className="h-3 w-3" />
            <span className="sr-only">Increase adults</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">{t('home.search.children')}</span>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateChildren(Math.max(0, value.children - 1))}
            disabled={value.children <= 0}
          >
            <MinusIcon className="h-3 w-3" />
            <span className="sr-only">Decrease children</span>
          </Button>
          <span className="w-8 text-center">{value.children}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateChildren(Math.min(10, value.children + 1))}
            disabled={value.children >= 10}
          >
            <PlusIcon className="h-3 w-3" />
            <span className="sr-only">Increase children</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
