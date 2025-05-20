import axios from "axios";

// ✅ Esta función se asegura de que siempre obtienes la variable correctamente
function getBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return `${base}/apartments`;
}

export enum ApartmentType {
  ONE_BEDROOM = "ONE_BEDROOM",
  TWO_BEDROOM = "TWO_BEDROOM",
}

export const apartmentTypes = Object.values(ApartmentType);

export interface Apartment {
  id: number;
  apartmentType: ApartmentType;
  capacity: number;
  floor: number;
  bedrooms: number;
  description: string;
  beds: any[];
}

export const getAllApartments = async (): Promise<Apartment[]> => {
  const res = await axios.get<Apartment[]>(getBaseUrl());
  return res.data;
};

export const getApartmentById = async (id: number): Promise<Apartment> => {
  const res = await axios.get<Apartment>(`${getBaseUrl()}/${id}`);
  return res.data;
};

export const createApartment = async (apartment: Apartment): Promise<Apartment> => {
  const res = await axios.post<Apartment>(getBaseUrl(), apartment);
  return res.data;
};

export const updateApartment = async (id: number, apartment: Apartment): Promise<Apartment> => {
  const res = await axios.put<Apartment>(`${getBaseUrl()}/${id}`, apartment);
  return res.data;
};

export const deleteApartment = async (id: number): Promise<void> => {
  await axios.delete(`${getBaseUrl()}/${id}`);
};

export const getApartmentTypes = async (): Promise<ApartmentType[]> => {
  const res = await axios.get<ApartmentType[]>(`${getBaseUrl()}/types`);
  return res.data;
};

export const getAvailableApartments = async ({
  startDate,
  endDate,
  type,
}: {
  startDate: string | null;
  endDate: string | null;
  type: ApartmentType | null;
}): Promise<Apartment[]> => {
  const res = await axios.get<Apartment[]>(`${getBaseUrl()}/available`, {
    params: { type, startDate, endDate },
  });
  return res.data;
};
