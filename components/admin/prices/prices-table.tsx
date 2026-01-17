"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Euro, Building, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Price, SortField, SortDirection } from "@/types/prices"

interface PricesTableProps {
  prices: Price[]
  filteredCount: number
  currentPage: number
  pageSize: number
  pageInput: string
  hasMorePages: boolean
  loading: boolean
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onPageChange: (page: number) => void
  onPageInputChange: (value: string) => void
  onPageInputSubmit: () => void
  onPageSizeChange: (value: string) => void
  onEdit: (price: Price) => void
  onDelete: (price: Price) => void
}

export function PricesTable({
  prices,
  filteredCount,
  currentPage,
  pageSize,
  pageInput,
  hasMorePages,
  loading,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onPageInputChange,
  onPageInputSubmit,
  onPageSizeChange,
  onEdit,
  onDelete,
}: PricesTableProps) {
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasMorePages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Precios</CardTitle>
            <CardDescription>
              {filteredCount} precios en la página {currentPage + 1}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {prices.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron precios</h3>
            <p className="text-muted-foreground">No hay precios que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("apartment.id")}>
                      Apartamento {sortField === "apartment.id" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("date")}>
                      Fecha {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort("price")}>
                      Precio {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prices.map((price) => {
                    const id = `${price.apartment?.id}-${price.date}`
                    return (
                      <TableRow key={id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{`Apartamento ${price.apartment?.id}`}</div>
                              <div className="text-sm text-muted-foreground">ID: {price.apartment?.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(parseISO(price.date), "dd MMM yyyy", { locale: es })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-bold text-lg">
                            <Euro className="h-4 w-4 text-muted-foreground" />
                            {price.price.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onEdit(price)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(id || "")
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Copiar ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onDelete(price)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Label htmlFor="page-size" className="text-sm whitespace-nowrap">
                  Resultados por página:
                </Label>
                <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
                  <SelectTrigger id="page-size" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Página</span>
                  <Input
                    type="number"
                    min="1"
                    value={pageInput}
                    onChange={(e) => onPageInputChange(e.target.value)}
                    onBlur={onPageInputSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onPageInputSubmit()
                      }
                    }}
                    className="w-16 text-center"
                    disabled={loading}
                  />
                </div>

                <Button variant="outline" size="icon" onClick={handleNextPage} disabled={!hasMorePages || loading}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Mostrando {filteredCount} resultado{filteredCount !== 1 ? "s" : ""}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
