'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit3, ArrowLeft, AlertCircle } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SearchForm } from '@/components/search-form';
import { SearchSummary } from '@/components/search-summary';
import { FilterControls } from '@/components/filter-controls';
import { ApartmentCard } from '@/components/apartment-card';
import { EmptyState } from '@/components/empty-state';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { useAvailabilitySearch } from '@/hooks/use-availability-search';
import { useApartmentFilters } from '@/hooks/use-apartment-filters';
import { handleReservation } from '@/utils/booking-utils';

export default function AvailabilityPage() {
  const router = useRouter();
  const [showSearchForm, setShowSearchForm] = useState(false);

  const {
    apartments,
    loading,
    error,
    searchParams,
    numberOfNights,
    formattedDates,
  } = useAvailabilitySearch();

  const {
    sortBy,
    setSortBy,
    filterByAvailability,
    setFilterByAvailability,
    filteredAndSortedApartments,
  } = useApartmentFilters(apartments);

  const handleReserve = async (apartmentId: number) => {
    const apartment = apartments.find(
      (apt) => apt.apartment.id === apartmentId
    );
    if (!apartment?.price) return;

    await handleReservation(
      apartmentId,
      searchParams.startDate!,
      searchParams.endDate!,
      searchParams.adults!,
      searchParams.children,
      apartment.price,
      router
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div>
        <SiteHeader />
        <div className="container py-12">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SiteHeader />
        <div className="container py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>*-
          </Alert>
          <Button onClick={handleGoBack} variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader />
      <div className="container py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Apartamentos Disponibles</h1>
            <Button
              variant="outline"
              onClick={() => setShowSearchForm(!showSearchForm)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Modificar búsqueda
            </Button>
          </div>

          {/* Search Form */}
          {showSearchForm && (
            <SearchForm
              initialData={{
                startDate: searchParams.startDate || '',
                endDate: searchParams.endDate || '',
                type: searchParams.type || '',
                adults: searchParams.adults || '1',
                children: searchParams.children || '0',
              }}
              onClose={() => setShowSearchForm(false)}
            />
          )}

          {/* Search Summary */}
          <SearchSummary
            formattedDates={formattedDates}
            adults={searchParams.adults}
            children={searchParams.children}
            type={searchParams.type}
            numberOfNights={numberOfNights}
          />
        </div>

        {/* Filters and Sorting */}
        <FilterControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterByAvailability={filterByAvailability}
          setFilterByAvailability={setFilterByAvailability}
          resultCount={filteredAndSortedApartments.length}
        />

        {/* Results */}
        {filteredAndSortedApartments.length === 0 ? (
          <EmptyState
            onModifySearch={() => setShowSearchForm(true)}
            onGoBack={handleGoBack}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.apartment.id}
                apartment={apartment}
                onReserve={handleReserve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
