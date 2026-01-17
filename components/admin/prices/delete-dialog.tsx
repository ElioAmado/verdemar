"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RefreshCw, Trash2 } from "lucide-react"
import type { Price } from "@/types/prices"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  priceToDelete: Price | null
  onConfirm: () => void
  deleting: boolean
}

export function DeleteDialog({ open, onOpenChange, priceToDelete, onConfirm, deleting }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar este precio?
            {priceToDelete && (
              <span className="block mt-2 font-medium">
                {`Apartamento ${priceToDelete.apartment?.id}`} -{" "}
                {format(parseISO(priceToDelete.date), "dd MMM yyyy", { locale: es })} - €
                {priceToDelete.price.toFixed(2)}
              </span>
            )}
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
