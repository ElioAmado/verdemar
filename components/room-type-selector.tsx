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
import { ApartmentType, ApartmentTypeArray} from '@/types/apartmentType';

export function RoomTypeSelector({
  onChange,
}: {
  onChange: (value: ApartmentType) => void;
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
          {ApartmentTypeArray.map((type) => (
            <SelectItem key={type} value={type}>
              {t(`${type}`)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
