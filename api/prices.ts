import axios from 'axios';
import { Apartment } from '@/types/apartment';
import { Price } from '@/types/prices';

export interface PriceRequestDTO {
  price: number;
}

const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const priceBaseUrl = `${base}/price`;

/**
 * Get all prices (returns entity)
 */
export async function getAllPrices(params?: PageableParams): Promise<Price[]> {
  const response = await axios.get<Price[]>(priceBaseUrl, { params: params });
  return response.data;
}

/**
 * Get all prices as DTO (PriceResponseDTO)
 */
export async function getAllPricesDto(): Promise<Price[]> {
  const response = await axios.get<Price[]>(`${priceBaseUrl}/dto`);
  return response.data;
}

/**
 * Get a specific price by apartment ID and date
 */
export async function getPriceById(
  apartmentId: number,
  date: string
): Promise<Price> {
  const response = await axios.get<Price>(
    `${priceBaseUrl}/${apartmentId}/${date}`
  );
  return response.data;
}

/**
 * Update an existing price
 */
export async function updatePrice(
  apartmentId: number,
  date: string,
  priceData: PriceRequestDTO
): Promise<Price> {
  const response = await axios.put<Price>(
    `${priceBaseUrl}/${apartmentId}/${date}`,
    priceData
  );
  return response.data;
}

/**
 * Delete a price (if the endpoint is re-enabled later)
 */
export async function deletePrice(
  apartmentId: number,
  date: string
): Promise<void> {
  await axios.delete(`${priceBaseUrl}/${apartmentId}/${date}`);
}

/**
 * Example of creating a price (if you re-enable POST later)
 */
export async function createPrice(priceData: Price): Promise<Price> {
  const response = await axios.post<Price>(priceBaseUrl, priceData);
  return response.data;
}

export async function createPrices(priceData: Price[]): Promise<Price> {
  const response = await axios.post<Price>(priceBaseUrl, priceData);
  return response.data;
}
