import axios from "axios";

export interface Client {
  id?: number; // opcional al crear
  name: string;
  lastName: string;
  phone: string;
  email: string;
}

function getClientBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return `${base}/clients`;
}

// Obtener todos los clientes
export const getAllClients = async (): Promise<Client[]> => {
  const res = await axios.get<Client[]>(getClientBaseUrl());
  return res.data;
};

// Obtener un cliente por ID
export const getClientById = async (id: number): Promise<Client> => {
  const res = await axios.get<Client>(`${getClientBaseUrl()}/${id}`);
  return res.data;
};

// Crear un nuevo cliente
export const createClient = async (client: Client): Promise<Client> => {
  const res = await axios.post<Client>(getClientBaseUrl(), client);
  return res.data;
};

// Actualizar un cliente
export const updateClient = async (id: number, client: Client): Promise<Client> => {
  const res = await axios.put<Client>(`${getClientBaseUrl()}/${id}`, client);
  return res.data;
};

// Eliminar un cliente
export const deleteClient = async (id: number): Promise<void> => {
  await axios.delete(`${getClientBaseUrl()}/${id}`);
};
