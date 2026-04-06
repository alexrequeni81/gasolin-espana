import type { GasStation, FuelType, PriceChange } from '../types';

const API_BASE_URL = 'https://api.precioil.es';

class PrecioilApi {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheDuration = 30 * 60 * 1000;

  private async fetchWithCache<T>(endpoint: string, cacheKey: string): Promise<T> {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  }

  async getStationsByRadius(lat: number, lng: number, radiusKm: number): Promise<GasStation[]> {
    const endpoint = `/estaciones/radio/${lat}/${lng}/${radiusKm}`;
    return this.fetchWithCache<GasStation[]>(endpoint, `radius-${lat}-${lng}-${radiusKm}`);
  }

  async getStationDetails(id: number): Promise<GasStation> {
    return this.fetchWithCache<GasStation>(`/estaciones/detalles/${id}`, `station-${id}`);
  }

  async getStationsByMunicipality(municipalityId: number): Promise<GasStation[]> {
    return this.fetchWithCache<GasStation[]>(
      `/estaciones/municipio/${municipalityId}`,
      `municipality-${municipalityId}`
    );
  }

  async getFuelTypes(): Promise<FuelType[]> {
    return this.fetchWithCache<FuelType[]>('/fuel-types', 'fuel-types');
  }

  async getRecentPriceChanges(minutes: number = 60): Promise<PriceChange[]> {
    return this.fetchWithCache<PriceChange[]>(
      `/cambios/precios?minutes=${minutes}`,
      `changes-${minutes}`
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const api = new PrecioilApi();
