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

  // Extraemos parámetros y asignamos '' si no vienen para evitar null
  const startDate = searchParams.get('start') || '';
  const endDate = searchParams.get('end') || '';
  const type = searchParams.get('type') || '';
  const adults = searchParams.get('adults') || '';
  const children = searchParams.get('children') || '';

  // Calcular noches
  const numberOfNights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Formatear fechas
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
        setApartments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      let data: ExtendedApartmentAvailability[] = [];

      try {
        data = await getAvailableApartments({ type, startDate, endDate });
      } catch (fetchError) {
        console.error('Error fetching apartments:', fetchError);
        setError('No se pudieron cargar los apartamentos disponibles');
        setApartments([]); // aseguramos no mostrar datos viejos
        setLoading(false);
        return;
      }

      // Inicializamos apartamentos con loading = true
      const apartmentsWithLoading = data.map((item) => ({
        ...item,
        loading: true,
        error: undefined,
      }));
      setApartments(apartmentsWithLoading);

      // Intentamos cargar precios, ignorando errores individuales
  const apartmentsWithPrices = await Promise.all(
    apartmentsWithLoading.map(async (item) => {
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
      } catch (priceError: any) {
        console.error(
          `Error loading price for apartment ${item.apartment.id}:`,
          priceError.message || priceError,
          {
            apartmentId: item.apartment.id,
            startDate,
            endDate,
            rawError: priceError,
          }
        );
        // Aquí devolvemos precio 0 y seguimos
        return {
          ...item,
          price: 0,
          pricePerNight: 0,
          loading: false,
          error: 'Precio no disponible',
        };
      }
    })
  );


      setApartments(apartmentsWithPrices);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate, type, numberOfNights]);

  return {
    apartments,
    loading,
    error,
    searchParams: { startDate, endDate, type, adults, children },
    numberOfNights,
    formattedDates,
  };
}
