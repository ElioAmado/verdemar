import { createBooking } from "@/api/booking";
import { Booking } from "@/types/booking";

/**
 * Parse CSV text into an array of Booking objects.
 */
const parseCSV = (csv: string): Booking[] => {
  const lines = csv.split("\n").filter((l) => l.trim() !== "");
  const header = lines.shift()?.split(",") || [];

  return lines.map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);

    const row: any = {};
    header.forEach((h, idx) => {
      row[h.trim()] = values[idx]?.trim();
    });

    return {
      clientId: row.client_id ? Number(row.client_id) : undefined,
      guests: Number(row.guests),
      apartmentId: row.apartment_id ? Number(row.apartment_id) : undefined,
      startDate: row.startDate,
      endDate: row.endDate || row.startDate,
      totalPrice: 0,
      status: row.status,
      notes: row.notes,
    } as Booking;
  });
};

/**
 * Fetches a CSV file and sends bookings to the API.
 */
export const sendBookings = async (csvUrl: string = "/csv/bookings.csv") => {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);

    const csvContent = await response.text();
    const bookings = parseCSV(csvContent);

    // for (const booking of bookings) {
    //   try {
    //     const saved = await createBooking(booking);
    //     console.log("Booking created:", saved.id);
    //   } catch (err) {
    //     console.error("Error creating booking:", booking, err);
    //   }
    // }
  } catch (err) {
    console.error("Error fetching CSV:", err);
  }
};
