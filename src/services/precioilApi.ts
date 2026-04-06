import type { GasStation } from '../types';

const API_BASE_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

interface APIEstacion {
  IDEESS: string;
  Nombre: string;
  Margen: string;
  Municipio: string;
  Localidad: string;
  Provincia: string;
  Código_Postal: string;
  Dirección: string;
  Latitud: string;
  Longitud: string;
  Precio_Gasolina_95_Octanos: string;
  Precio_Gasolina_98_Octanos: string;
  Precio_Gasoleo_A: string;
  Precio_Gasoleo_Premium: string;
  Precio_Bioetanol: string;
  Precio_Biodiesel: string;
  Precio_Gas_Natural_Comprimido: string;
  Precio_Gas_Natural_Licuado: string;
  Precio_Gases_Licuados_Petroleo: string;
  Horario: string;
  Remisión: string;
  Tipo_Venta: string;
  Fecha: string;
}

interface APIResponse {
  Fecha: string;
  ListaEESSPrecio: APIEstacion[];
}

class FuelApi {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheDuration = 30 * 60 * 1000;
  private allStationsCache: { data: GasStation[]; timestamp: number } | null = null;

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

  private mapApiToGasStation(apiStation: APIEstacion): GasStation {
    return {
      idEstacion: parseInt(apiStation.IDEESS) || 0,
      nombreEstacion: apiStation.Nombre || '',
      marca: apiStation.Nombre || '',
      direccion: apiStation.Dirección || '',
      localidad: apiStation.Localidad || '',
      codPostal: apiStation.Código_Postal || '',
      municipio: apiStation.Municipio || '',
      provincia: apiStation.Provincia || '',
      provinciaDistrito: apiStation.Provincia || '',
      latitud: apiStation.Latitud || '0',
      longitud: apiStation.Longitud || '0',
      horario: apiStation.Horario || '',
      margen: apiStation.Margen || '',
      tipoVenta: apiStation.Tipo_Venta || '',
      Gasolina95: apiStation.Precio_Gasolina_95_Octanos || null,
      Gasolina95_media: null,
      Gasolina98: apiStation.Precio_Gasolina_98_Octanos || null,
      Gasolina98_media: null,
      Diesel: apiStation.Precio_Gasoleo_A || null,
      Diesel_media: null,
      DieselPremium: apiStation.Precio_Gasoleo_Premium || null,
      DieselPremium_media: null,
      DieselB_media: null,
      GLP_media: null,
      HVO_media: null,
      lastUpdate: apiStation.Fecha || '',
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async getAllStations(): Promise<GasStation[]> {
    const now = Date.now();
    if (this.allStationsCache && now - this.allStationsCache.timestamp < this.cacheDuration) {
      return this.allStationsCache.data;
    }

    const response = await this.fetchWithCache<APIResponse>(
      '/EstacionesTerrestres/',
      'all-stations'
    );
    const stations = response.ListaEESSPrecio.map(this.mapApiToGasStation);
    this.allStationsCache = { data: stations, timestamp: now };
    return stations;
  }

  async getStationsByRadius(lat: number, lng: number, radiusKm: number): Promise<GasStation[]> {
    const allStations = await this.getAllStations();

    const stationsWithDistance = allStations
      .filter(station => {
        const stationLat = parseFloat(station.latitud);
        const stationLng = parseFloat(station.longitud);
        if (isNaN(stationLat) || isNaN(stationLng) || stationLat === 0 || stationLng === 0) {
          return false;
        }
        const distance = this.calculateDistance(lat, lng, stationLat, stationLng);
        return distance <= radiusKm;
      })
      .map(station => {
        const distance = this.calculateDistance(
          lat,
          lng,
          parseFloat(station.latitud),
          parseFloat(station.longitud)
        );
        return { ...station, distancia: distance };
      })
      .sort((a, b) => (a.distancia || 0) - (b.distancia || 0));

    return stationsWithDistance;
  }

  async getStationsByProvince(provinceId: string): Promise<GasStation[]> {
    const response = await this.fetchWithCache<APIResponse>(
      `/EstacionesTerrestres/FiltroProvincia/${provinceId}`,
      `province-${provinceId}`
    );
    return response.ListaEESSPrecio.map(this.mapApiToGasStation);
  }

  clearCache(): void {
    this.cache.clear();
    this.allStationsCache = null;
  }
}

export const api = new FuelApi();
