import { createBooking, type Booking } from "@/api/booking"

export async function handleReservation(
  apartmentId: number,
  startDate: string,
  endDate: string,
  adults: string,
  children: string | null,
  totalPrice: number,
  router: any,
) {
  if (!startDate || !endDate || !adults) {
    alert("Por favor, selecciona fechas y número de huéspedes válidos.")
    return
  }

  if (totalPrice === undefined) {
    alert("El precio total aún no está disponible.")
    return
  }

  const booking: Booking = {
    guests: Number.parseInt(adults, 10) + (children ? Number.parseInt(children, 10) : 0),
    apartmentId: apartmentId,
    startDate: startDate,
    endDate: endDate,
    totalPrice: totalPrice,
    status: "PENDING",
  }

  try {
    const created = await createBooking(booking)
    localStorage.setItem("pendingBookingId", JSON.stringify(created.id))
    router.push("/booking")
  } catch (error) {
    console.error("Error al crear la reserva:", error)
    alert("Hubo un problema al crear la reserva. Intenta de nuevo.")
  }
}
