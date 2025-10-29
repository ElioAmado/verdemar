'use client';

/**
 * Hook personalizado para manejar la carga de datos de apartamentos
 */

import { useState, useEffect } from 'react';
import { getAllIds } from '@/api/apartment';
import { getDatesByApartmentId } from '@/api/booking';
import type { DefaultDateRange } from '@/types/defaultDateRange';

export function useApartmentData() {
  const [apartmentIds, setApartmentIds] = useState<number[]>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(
    null
  );
  const [dateRanges, setDateRanges] = useState<DefaultDateRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar IDs de apartamentos
  useEffect(() => {
    const fetchApartmentIds = async () => {
      try {
        setLoading(true);
        const ids = await getAllIds();
        setApartmentIds(ids);
        if (ids.length > 0) {
          setSelectedApartmentId(ids[0]);
        }
      } catch (err) {
        setError('Error al cargar los apartamentos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartmentIds();
  }, []);

  // Cargar rangos de fechas
  useEffect(() => {
    const fetchDateRanges = async () => {
      if (selectedApartmentId !== null) {
        try {
          setRefreshing(true);
          setError(null);
          const ranges = await getDatesByApartmentId(selectedApartmentId);
          setDateRanges(ranges);
        } catch (err) {
          setError('Error al cargar las reservas');
          console.error(err);
        } finally {
          setRefreshing(false);
        }
      } else {
        setDateRanges([]);
      }
    };

    fetchDateRanges();
  }, [selectedApartmentId]);

  const handleRefresh = async () => {
    if (selectedApartmentId !== null) {
      setRefreshing(true);
      try {
        const ranges = await getDatesByApartmentId(selectedApartmentId);
        setDateRanges(ranges);
      } catch (err) {
        setError('Error al actualizar las reservas');
      } finally {
        setRefreshing(false);
      }
    }
  };

  return {
    apartmentIds,
    selectedApartmentId,
    setSelectedApartmentId,
    dateRanges,
    loading,
    error,
    refreshing,
    handleRefresh,
  };
}
