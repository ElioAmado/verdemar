export enum ApartmentType {
  ONE_BEDROOM = 'ONE_BEDROOM',
  TWO_BEDROOM = 'TWO_BEDROOM',
}

export const apartmentTypeLabels: Record<ApartmentType, string> = {
  [ApartmentType.ONE_BEDROOM]: '1 Dormitorio',
  [ApartmentType.TWO_BEDROOM]: '2 Dormitorios',
};