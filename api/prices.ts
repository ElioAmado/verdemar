import axios from 'axios';
import { Apartment } from '@/types/apartment';
import { Price, UpdatePriceRequest } from '@/types/prices';

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
 * Get prices for a specific apartment and month
 *
 * @param apartmentId Apartment ID
 * @param month Month (1-12)
 * @param year Full year (e.g. 2026)
 * @returns List of prices
 */
export const getPricesByMonth = async (
  apartmentId: number,
  month: number,
  year: number
): Promise<Price[]> => {
  console.log(`Fetching prices for Apartment ID: ${apartmentId}, Month: ${month}, Year: ${year}`);
  const response = await axios.get<Price[]>(`${priceBaseUrl}/bymonth`, {
    params: {
      apartmentId,
      month,
      year,
    },
  });
  console.log(`Fetched ${response.data.length} prices`);
  return response.data;
};

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
 * Bulk update prices
 *
 * @param prices List of prices to update
 * @returns Updated prices
 */
export const bulkUpdatePrices = async (
  prices: UpdatePriceRequest[]
): Promise<Price[]> => {
  console.log(`Bulk updating ${prices.length} prices`);
  console.log('Prices data:', prices);
  const response = await axios.put<Price[]>(
    `${priceBaseUrl}/bulk`,
    prices, // BODY JSON
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

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
export async function createPrice(priceData: UpdatePriceRequest): Promise<Price> {
  const response = await axios.post<Price>(`${priceBaseUrl}/bulk`, priceData);
  return response.data;
}

// Unenabled bulk create function
export async function createPrices(priceData: UpdatePriceRequest[]): Promise<Price> {
  const response = await axios.post<Price>(`${priceBaseUrl}/bulk`, priceData,);
  return response.data;
}
