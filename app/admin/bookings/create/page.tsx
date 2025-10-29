'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking, getTotalPrice } from '@/api/booking';
import { getAllClients } from '@/api/client';
import { getAllApartments } from '@/api/apartment';
import { Client } from '@/api/client';
import { Apartment } from '@/api/apartment';

const STATUS_OPTIONS = [
  { label: 'Pendiente', value: 'PENDING' },
  { label: 'Confirmado', value: 'CONFIRMED' },
  { label: 'Cancelado', value: 'CANCELLED' },
  { label: 'Completado', value: 'COMPLETED' },
];

export default function CreateBookingPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  const [form, setForm] = useState({
    clientId: 0,
    apartmentId: 0,
    guests: 1,
    startDate: '',
    endDate: '',
    notes: '',
    totalPrice: 0,
    status: 'PENDING', // Valor por defecto en mayúsculas
  });

  useEffect(() => {
    const fetchData = async () => {
      const c = await getAllClients();
      const a = await getAllApartments();
      setClients(c);
      setApartments(a);
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total = await getTotalPrice(
        Number(form.apartmentId),
        form.startDate,
        form.endDate
      );

      const newBooking = await createBooking({
        ...form,
        clientId: Number(form.clientId),
        apartmentId: Number(form.apartmentId),
        guests: Number(form.guests),
        totalPrice: total,
      });

      router.push('/admin/bookings');
    } catch (err) {
      console.error('Error al crear reserva:', err);
      alert('❌ Error al crear reserva.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nueva reserva</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cliente */}
        <div>
          <label className="block font-medium">Cliente</label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value={0}>Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Apartamento */}
        <div>
          <label className="block font-medium">Apartamento</label>
          <select
            name="apartmentId"
            value={form.apartmentId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value={0}>Selecciona un apartamento</option>
            {apartments.map((a) => (
              <option key={a.id} value={a.id}>
                ID {a.id} - {a.name ?? 'Sin nombre'}
              </option>
            ))}
          </select>
        </div>

        {/* Huéspedes */}
        <div>
          <label className="block font-medium">Número de huéspedes</label>
          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            min={1}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Fecha inicio */}
        <div>
          <label className="block font-medium">Fecha de inicio</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Fecha fin */}
        <div>
          <label className="block font-medium">Fecha de fin</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block font-medium">Notas</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          ></textarea>
        </div>

        {/* Estado */}
        <div>
          <label className="block font-medium">Estado</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            {STATUS_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push('/admin/bookings')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Crear reserva
          </button>
        </div>
      </form>
    </div>
  );
}
