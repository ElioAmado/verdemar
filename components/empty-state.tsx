'use client';

import { Button } from '@/components/ui/button';
import { Building, Edit3, ArrowLeft } from 'lucide-react';

interface EmptyStateProps {
  onModifySearch: () => void;
  onGoBack: () => void;
}

export function EmptyState({ onModifySearch, onGoBack }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        No se encontraron apartamentos
      </h3>
      <p className="text-muted-foreground mb-4">
        No hay apartamentos disponibles para los criterios seleccionados.
      </p>
      <div className="flex gap-2 justify-center">
        <Button onClick={onModifySearch} variant="default">
          <Edit3 className="h-4 w-4 mr-2" />
          Modificar búsqueda
        </Button>
        <Button onClick={onGoBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    </div>
  );
}
