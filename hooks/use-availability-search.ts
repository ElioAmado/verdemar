import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAvailableApartments } from '@/api/apartment';
import { getTotalPrice } from '@/api/booking';
import type { ExtendedApartmentAvailability } from '@/types/availability';

export function useAvailabilitySearch() {
  const searchParams = useSearchParams();
  const [apartments, setApartments] = useState<ExtendedApartmentAvailability[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract search parameters
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');
  const type = searchParams.get('type');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Format dates for display
  const formattedDates = useMemo(() => {
    if (!startDate || !endDate) return null;
    const { format } = require('date-fns');
    const { es } = require('date-fns/locale');
    return {
      start: format(new Date(startDate), 'dd MMM yyyy', { locale: es }),
      end: format(new Date(endDate), 'dd MMM yyyy', { locale: es }),
    };
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !type) {
        setError('Parámetros de búsqueda incompletos');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getAvailableApartments({ type, startDate, endDate });

        // Try-catch específico para el mapeo
        let apartmentsWithPricing: ExtendedApartmentAvailability[] = [];

        try {
          apartmentsWithPricing = data.map((item) => ({
            ...item,
            loading: true,
          }));
        } catch (mapError) {
          console.error(
            'Error inicializando apartamentos con estado de carga:',
            mapError,
            'Data: ',
            data
          );
          setError('Error al procesar los apartamentos disponibles');
          setLoading(false);
          return;
        }

        setApartments(apartmentsWithPricing);

        const updatedApartments = await Promise.all(
          apartmentsWithPricing.map(async (item) => {
            try {
              const totalPrice = await getTotalPrice(
                item.apartment.id,
                startDate,
                endDate
              );
              const pricePerNight =
                numberOfNights > 0 ? totalPrice / numberOfNights : 0;

              return {
                ...item,
                price: totalPrice,
                pricePerNight,
                loading: false,
                error: undefined,
              };
            } catch (error) {
              console.error(
                `Error fetching price for apartment ${item.apartment.id}:`,
                error
              );
              return {
                ...item,
                loading: false,
                error: 'Error al cargar el precio',
              };
            }
          })
        );

        setApartments(updatedApartments);
      } catch (error) {
        console.error('Error fetching apartments:', error);
        setError('Error al cargar los apartamentos disponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, numberOfNights]);

  return {
    apartments,
    loading,
    error,
    searchParams: {
      startDate,
      endDate,
      type,
      adults,
      children,
    },
    numberOfNights,
    formattedDates,
  };
}
