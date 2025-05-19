// src/api/apartment.api.ts

import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/apartments";

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
  beds: any[]; // Puedes definir mejor si tienes un modelo Bed
}

export const getAllApartments = async (): Promise<Apartment[]> => {
  const res = await axios.get<Apartment[]>(BASE_URL);
  return res.data;
};

export const getApartmentById = async (id: number): Promise<Apartment> => {
  const res = await axios.get<Apartment>(`${BASE_URL}/${id}`);
  return res.data;
};

export const createApartment = async (apartment: Apartment): Promise<Apartment> => {
  const res = await axios.post<Apartment>(BASE_URL, apartment);
  return res.data;
};

export const updateApartment = async (id: number, apartment: Apartment): Promise<Apartment> => {
  const res = await axios.put<Apartment>(`${BASE_URL}/${id}`, apartment);
  return res.data;
};

export const deleteApartment = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getApartmentTypes = async (): Promise<ApartmentType[]> => {
  const res = await axios.get<ApartmentType[]>(`${BASE_URL}/types`);
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
  const res = await axios.get<Apartment[]>(`${BASE_URL}/available`, {
    params: { startDate, endDate, type },
  });
  return res.data;
};
