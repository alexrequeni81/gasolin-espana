import type { GasStation } from '../types';

const API_BASE_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

interface APIEstacion {
  IDEESS: string;
  Rótulo: string;
  Margen: string;
  Municipio: string;
  Localidad: string;
  Provincia: string;
  'C.P.': string;
  Dirección: string;
  Latitud: string;
  'Longitud (WGS84)': string;
  'Precio Gasolina 95 E5': string;
  'Precio Gasolina 98 E5': string;
  'Precio Gasoleo A': string;
  'Precio Gasoleo Premium': string;
  Horario: string;
  Remisión: string;
  'Tipo Venta': string;
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

  private parseSpanishNumber(value: string): number {
    if (!value || value.trim() === '') return 0;
    return parseFloat(value.replace(',', '.'));
  }

  private async fetchWithCache<T>(endpoint: string, cacheKey: string): Promise<T> {
    console.log('[API] Fetching:', `${API_BASE_URL}${endpoint}`);

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('[API] Using cached data for:', cacheKey);
      return cached.data as T;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log('[API] Response status:', response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[API] Data received, keys:', Object.keys(data));
      console.log('[API] ListaEESSPrecio length:', data.ListaEESSPrecio?.length);

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T;
    } catch (err) {
      console.error('[API] Fetch error:', err);
      throw err;
    }
  }

  private mapApiToGasStation(apiStation: APIEstacion): GasStation {
    return {
      idEstacion: parseInt(apiStation.IDEESS) || 0,
      nombreEstacion: apiStation['Rótulo'] || '',
      marca: apiStation['Rótulo'] || '',
      direccion: apiStation.Dirección || '',
      localidad: apiStation.Localidad || '',
      codPostal: apiStation['C.P.'] || '',
      municipio: apiStation.Municipio || '',
      provincia: apiStation.Provincia || '',
      provinciaDistrito: apiStation.Provincia || '',
      latitud: apiStation.Latitud || '0',
      longitud: apiStation['Longitud (WGS84)'] || '0',
      horario: apiStation.Horario || '',
      margen: apiStation.Margen || '',
      tipoVenta: apiStation['Tipo Venta'] || '',
      Gasolina95: apiStation['Precio Gasolina 95 E5'] || null,
      Gasolina95_media: null,
      Gasolina98: apiStation['Precio Gasolina 98 E5'] || null,
      Gasolina98_media: null,
      Diesel: apiStation['Precio Gasoleo A'] || null,
      Diesel_media: null,
      DieselPremium: apiStation['Precio Gasoleo Premium'] || null,
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
      console.log('[API] Using allStationsCache');
      return this.allStationsCache.data;
    }

    const response = await this.fetchWithCache<APIResponse>(
      '/EstacionesTerrestres/',
      'all-stations'
    );
    console.log('[API] Mapping stations, count:', response.ListaEESSPrecio.length);
    const stations = response.ListaEESSPrecio.map(station => {
      const mapped = this.mapApiToGasStation(station);
      console.log('[API] Sample station lat:', mapped.latitud, 'lng:', mapped.longitud);
      return mapped;
    });
    this.allStationsCache = { data: stations, timestamp: now };
    console.log('[API] Stations mapped, total:', stations.length);
    return stations;
  }

  async getStationsByRadius(lat: number, lng: number, radiusKm: number): Promise<GasStation[]> {
    console.log('[API] getStationsByRadius:', { lat, lng, radiusKm });
    const allStations = await this.getAllStations();
    console.log('[API] Filtering from', allStations.length, 'stations');

    const stationsWithDistance = allStations
      .filter(station => {
        const stationLat = this.parseSpanishNumber(station.latitud);
        const stationLng = this.parseSpanishNumber(station.longitud);

        console.log(
          '[API] Checking station:',
          station.nombreEstacion,
          'lat:',
          stationLat,
          'lng:',
          stationLng
        );

        if (isNaN(stationLat) || isNaN(stationLng) || stationLat === 0 || stationLng === 0) {
          return false;
        }
        const distance = this.calculateDistance(lat, lng, stationLat, stationLng);
        return distance <= radiusKm;
      })
      .map(station => {
        const stationLat = this.parseSpanishNumber(station.latitud);
        const stationLng = this.parseSpanishNumber(station.longitud);
        const distance = this.calculateDistance(lat, lng, stationLat, stationLng);
        return { ...station, distancia: distance };
      })
      .sort((a, b) => (a.distancia || 0) - (b.distancia || 0));

    console.log('[API] Filtered stations:', stationsWithDistance.length);
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
