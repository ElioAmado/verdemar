import { ApartmentType } from "./apartmentType";

export interface Apartment {
  id: number;
  apartmentType: ApartmentType;
  capacity: number;
  floor: number;
  bedrooms: number;
  // description: string;
  beds: any[];
}