import { Apartment } from "@/types/apartment";
import { ApartmentType } from "@/types/apartmentType";
import axios from "axios";

// ✅ Esta función se asegura de que siempre obtienes la variable correctamente
function getBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return `${base}/apartment`;
}



export const apartmentTypes = Object.values(ApartmentType);

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

export const getAllIds = async (): Promise<number[]> => {
  const res = await axios.get<number[]>(`${getBaseUrl()}/ids`);
  return res.data;
}

export interface ApartmentAvailability {
  apartment: Apartment;
  available: boolean;
}

export const getAvailableApartments = async ({
  startDate,
  endDate,
  type,
}: {
  startDate: string | null;
  endDate: string | null;
  type: ApartmentType | null;
}): Promise<ApartmentAvailability[]> => {
  const res = await axios.get<ApartmentAvailability[]>(`${getBaseUrl()}/available`, {
    params: { type, startDate, endDate },
  });

  return res.data;
};
