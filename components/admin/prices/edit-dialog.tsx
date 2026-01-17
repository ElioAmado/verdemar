"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RefreshCw, Check } from "lucide-react"

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editPrice: string
  onPriceChange: (value: string) => void
  editApartmentId: string
  onApartmentIdChange: (value: string) => void
  editDate: string
  onDateChange: (value: string) => void
  onSave: () => void
  saving: boolean
}

export function EditDialog({
  open,
  onOpenChange,
  editPrice,
  onPriceChange,
  editApartmentId,
  onApartmentIdChange,
  editDate,
  onDateChange,
  onSave,
  saving,
}: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Precio</DialogTitle>
          <DialogDescription>Modifica los detalles del precio seleccionado</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-apartment">Apartamento ID</Label>
            <Input
              id="edit-apartment"
              type="number"
              value={editApartmentId}
              onChange={(e) => onApartmentIdChange(e.target.value)}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Fecha</Label>
            <Input id="edit-date" type="date" value={editDate} onChange={(e) => onDateChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price">Precio (€)</Label>
            <Input
              id="edit-price"
              type="number"
              value={editPrice}
              onChange={(e) => onPriceChange(e.target.value)}
              min={0}
              step={0.01}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving || !editPrice || !editApartmentId || !editDate}>
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
