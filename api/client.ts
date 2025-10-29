import type { Client } from '@/types/client';

// Mock data for development

// Base API URL - replace with your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const mockClients: Client[] = [];
/**
 * Fetches all clients from the API
 */
export async function getAllClients(): Promise<Client[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/client`);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    // Return mock data for development
    return mockClients;
  }
}

/**
 * Fetches a single client by ID
 */
export async function getClientById(id: number): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching client:', error);
    const mockClient = mockClients.find((c) => c.id === id);
    if (!mockClient) {
      throw new Error('Client not found');
    }
    return mockClient;
  }
}

/**
 * Creates a new client
 */
export async function createClient(
  client: Omit<Client, 'id'>
): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating client:', error);
    // Return mock data for development
    const newClient: Client = {
      ...client,
      id: Math.max(...mockClients.map((c) => c.id || 0)) + 1,
    };
    mockClients.push(newClient);
    return newClient;
  }
}

/**
 * Updates an existing client
 */
export async function updateClient(
  id: number,
  client: Partial<Client>
): Promise<Client> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error('Failed to update client');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating client:', error);
    // Return mock data for development
    const existingClient = mockClients.find((c) => c.id === id);
    if (!existingClient) {
      throw new Error('Client not found');
    }
    const updatedClient = {
      ...existingClient,
      ...client,
    };
    const index = mockClients.findIndex((c) => c.id === id);
    mockClients[index] = updatedClient;
    return updatedClient;
  }
}

/**
 * Deletes a client by ID
 */
export async function deleteClient(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete client');
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    // Remove from mock data for development
    const index = mockClients.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockClients.splice(index, 1);
    }
  }
}

export type { Client };
