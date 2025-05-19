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
import { apartmentTypes, ApartmentType } from '@/api/apartment';

export function RoomTypeSelector({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('roomSelector.selectRoom')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('common.apartaments')}</SelectLabel>
          {apartmentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {t(`roomSelector.${type}`)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
