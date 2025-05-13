'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/language-context';

export function RoomTypeSelector() {
  const { t } = useLanguage();

  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('roomSelector.selectRoom')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('common.rooms')}</SelectLabel>
          <SelectItem value="deluxe">{t('roomSelector.deluxe')}</SelectItem>
          <SelectItem value="executive">
            {t('roomSelector.executive')}
          </SelectItem>
          <SelectItem value="presidential">
            {t('roomSelector.presidential')}
          </SelectItem>
          <SelectItem value="family">{t('roomSelector.family')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
