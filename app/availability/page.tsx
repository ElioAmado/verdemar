'use client';

import { useState, Suspense } from 'react';
import { ApartmentSearchForm } from '@/components/apartment-search-form';
import { ApartmentTypeCard } from '@/components/apartment-type-card';
import { getAvailableApartments } from '@/api/apartment';
import { ApartmentType } from '@/types/apartmentType';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface TypeAvailability {
  type: ApartmentType;
  available: boolean;
  price: number;
}

interface SearchData {
  startDate: string;
  endDate: string;
  guests: number;
  apartmentType: ApartmentType | null;
}

function calculateNights(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function ApartmentSearchContent() {
  const searchParams = useSearchParams();
  
  // Leer parámetros de la URL
  const urlStartDate = searchParams.get('start') || '';
  const urlEndDate = searchParams.get('end') || '';
  const urlAdults = Number(searchParams.get('adults')) || 0;
  const urlChildren = Number(searchParams.get('children')) || 0;
  const totalGuests = urlAdults + urlChildren || 1;
  
  // Determinar si hay parámetros para auto-búsqueda
  const hasUrlParams = urlStartDate && urlEndDate;

  const [typeAvailabilities, setTypeAvailabilities] = useState<TypeAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const handleSearch = async (data: SearchData) => {
    setIsLoading(true);
    setError(null);
    setSearchData(data);

    try {
      const results = await getAvailableApartments({
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.apartmentType,
      });

      // Agrupar por tipo de apartamento
      // Para cada tipo, verificar si hay al menos uno disponible y obtener el precio más bajo
      const typeMap = new Map<ApartmentType, { available: boolean; price: number }>();
      
      for (const apt of results) {
        const type = apt.apartment.type;
        const existing = typeMap.get(type);
        
        if (!existing) {
          typeMap.set(type, {
            available: apt.available,
            price: apt.apartment.price,
          });
        } else {
          // Si al menos uno está disponible, el tipo está disponible
          // Usar el precio más bajo disponible
          typeMap.set(type, {
            available: existing.available || apt.available,
            price: apt.available ? Math.min(existing.price, apt.apartment.price) : existing.price,
          });
        }
      }

      // Convertir a array y filtrar según número de personas
      let availabilities: TypeAvailability[] = Array.from(typeMap.entries()).map(
        ([type, data]) => ({
          type,
          available: data.available,
          price: data.price,
        })
      );

      // Si hay más de 3 personas, solo mostrar apartamentos de 2 dormitorios
      if (data.guests > 3) {
        availabilities = availabilities.filter(
          (apt) => apt.type === ApartmentType.TWO_BEDROOM
        );
      }

      // Ordenar: 1 dormitorio primero, luego 2 dormitorios
      availabilities.sort((a, b) => {
        if (a.type === ApartmentType.ONE_BEDROOM) return -1;
        if (b.type === ApartmentType.ONE_BEDROOM) return 1;
        return 0;
      });

      setTypeAvailabilities(availabilities);
      setHasSearched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al buscar apartamentos. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const nights = searchData
    ? calculateNights(searchData.startDate, searchData.endDate)
    : 0;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Búsqueda de Apartamentos
              </h1>
              <p className="text-muted-foreground">
                Encuentra el apartamento perfecto para tu estancia
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Formulario de búsqueda */}
        <ApartmentSearchForm 
          onSearch={handleSearch} 
          isLoading={isLoading}
          initialStartDate={urlStartDate}
          initialEndDate={urlEndDate}
          initialGuests={totalGuests}
          autoSearch={hasUrlParams}
        />

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Resultados */}
        {hasSearched && !error && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Opciones disponibles
              </h2>
              {searchData && (
                <p className="text-sm text-muted-foreground">
                  {nights} {nights === 1 ? 'noche' : 'noches'} · {searchData.guests}{' '}
                  {searchData.guests === 1 ? 'persona' : 'personas'}
                </p>
              )}
            </div>

            {typeAvailabilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {typeAvailabilities.map((typeData) => (
                  <ApartmentTypeCard
                    key={typeData.type}
                    type={typeData.type}
                    price={typeData.price}
                    available={typeData.available}
                    nights={nights}
                    startDate={searchData?.startDate || ''}
                    endDate={searchData?.endDate || ''}
                    guests={searchData?.guests || 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay apartamentos disponibles
                </h3>
                <p className="text-muted-foreground">
                  Intenta cambiar las fechas o el número de personas
                </p>
              </div>
            )}
          </section>
        )}

        {/* Mensaje inicial */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Selecciona las fechas y el número de personas para comenzar la
              búsqueda
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Búsqueda de Apartamentos
              </h1>
              <p className="text-muted-foreground">
                Encuentra el apartamento perfecto para tu estancia
              </p>
            </div>
          </div>
        </div>
      </header>
      <div className="container py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ApartmentSearchContent />
    </Suspense>
  );
}
