"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllBookings,
  deleteBooking,
  Booking,
} from "@/api/booking";
import { format } from "date-fns";

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        setError("Error al obtener las reservas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (bookingId?: number) => {
    if (!bookingId) return;
    const confirmed = confirm("¿Eliminar esta reserva?");
    if (!confirmed) return;

    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error("Error al eliminar reserva:", err);
      alert("❌ Error al eliminar la reserva.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reservas</h1>
        <div className="space-x-2">
          <button
            onClick={() => router.push("/admin")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al panel
          </button>
          <button
            onClick={() => router.push("/admin/bookings/create")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Nueva reserva
          </button>
        </div>
      </div>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No hay reservas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Cliente</th>
                <th className="py-2 px-4 border">Apartamento</th>
                <th className="py-2 px-4 border">Fechas</th>
                <th className="py-2 px-4 border">Huéspedes</th>
                <th className="py-2 px-4 border">Precio Total</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Notas</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4 border text-center">{b.id}</td>
                  <td className="py-2 px-4 border">
                    {b.client ? `${b.client.name} (${b.client.email})` : `ID: ${b.clientId}`}
                  </td>
                  <td className="py-2 px-4 border">
                    {b.apartment ? b.apartment.id : `ID: ${b.apartmentId}`}
                  </td>
                  <td className="py-2 px-4 border">
                    {format(new Date(b.startDate), "dd/MM/yyyy")} -{" "}
                    {format(new Date(b.endDate), "dd/MM/yyyy")}
                  </td>
                  <td className="py-2 px-4 border text-center">{b.guests}</td>
                  <td className="py-2 px-4 border text-right">€{b.totalPrice.toFixed(2)}</td>
                  <td className="py-2 px-4 border text-center">{b.status}</td>
                  <td className="py-2 px-4 border">{b.notes ?? "-"}</td>
                  <td className="py-2 px-4 border text-center space-x-2">
                    <button
                      onClick={() => alert(`Editar reserva ID: ${b.id}`)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
