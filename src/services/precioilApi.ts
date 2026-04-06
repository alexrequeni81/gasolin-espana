import type { GasStation, FuelTypeId } from '../types';

const API_BASE_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

interface APIEstacion {
  IDEESS: string;
  Rótulo: string;
  Domicilio: string;
  Localidad: string;
  Provincia: string;
  'C.P.': string;
  Latitud: string;
  'Longitud (WGS84)': string;
  Municipio: string;
  Margen: string;
  'Tipo Venta': string;
  Horario: string;
  Remisión: string;
  Fecha: string;
  IDMunicipio: string;
  IDProvincia: string;
  IDCCAA: string;
  '% BioEtanol': string;
  '% Éster metílico': string;
  'Precio Gasolina 95 E5': string;
  'Precio Gasolina 95 E10': string;
  'Precio Gasolina 95 E25': string;
  'Precio Gasolina 95 E5 Premium': string;
  'Precio Gasolina 95 E85': string;
  'Precio Gasolina 98 E5': string;
  'Precio Gasolina 98 E10': string;
  'Precio Gasolina Renovable': string;
  'Precio Gasoleo A': string;
  'Precio Gasoleo B': string;
  'Precio Gasoleo Premium': string;
  'Precio Biodiesel': string;
  'Precio Diésel Renovable': string;
  'Precio Gas Natural Comprimido': string;
  'Precio Gas Natural Licuado': string;
  'Precio Biogas Natural Comprimido': string;
  'Precio Biogas Natural Licuado': string;
  'Precio Gases licuados del petróleo': string;
  'Precio Adblue': string;
  'Precio Amoniaco': string;
  'Precio Bioetanol': string;
  'Precio Hidrogeno': string;
  'Precio Metanol': string;
}

interface APIResponse {
  Fecha: string;
  ListaEESSPrecio: APIEstacion[];
}

const RADII = [5, 10, 20, 50];
const MAX_RESULTS = 10;
const DISTANCE_MULTIPLIER = 1.4;

const PROVINCE_MAP: Record<string, string> = {
  '01': 'Alava',
  '02': 'Albacete',
  '03': 'Alicante',
  '04': 'Almería',
  '05': 'Ávila',
  '06': 'Badajoz',
  '07': 'Baleares',
  '08': 'Barcelona',
  '09': 'Burgos',
  '10': 'Cáceres',
  '11': 'Cádiz',
  '12': 'Castellón',
  '13': 'Ciudad Real',
  '14': 'Córdoba',
  '15': 'Coruña',
  '16': 'Cuenca',
  '17': 'Girona',
  '18': 'Granada',
  '19': 'Guadalajara',
  '20': 'Gipuzkoa',
  '21': 'Huelva',
  '22': 'Huesca',
  '23': 'Jaén',
  '24': 'León',
  '25': 'Lleida',
  '26': 'La Rioja',
  '27': 'Lugo',
  '28': 'Madrid',
  '29': 'Málaga',
  '30': 'Murcia',
  '31': 'Navarra',
  '32': 'Ourense',
  '33': 'Asturias',
  '34': 'Palencia',
  '35': 'Las Palmas',
  '36': 'Pontevedra',
  '37': 'Salamanca',
  '38': 'Santa Cruz de Tenerife',
  '39': 'Cantabria',
  '40': 'Segovia',
  '41': 'Sevilla',
  '42': 'Soria',
  '43': 'Tarragona',
  '44': 'Teruel',
  '45': 'Toledo',
  '46': 'Valencia',
  '47': 'Valladolid',
  '48': 'Bizkaia',
  '49': 'Zamora',
  '50': 'Zaragoza',
  '51': 'Ceuta',
  '52': 'Melilla',
};

function getProvinceFromCoords(lat: number, lng: number): string | null {
  if (lat >= 39 && lat <= 40.5 && lng >= -1.3 && lng <= 0.5) return 'Valencia';
  if (lat >= 37.5 && lat <= 39.5 && lng >= -1.5 && lng <= 0.5) return 'Murcia';
  if (lat >= 36 && lat <= 38.5 && lng >= -7.5 && lng <= -4.5) return 'Andalucía';
  if (lat >= 38.5 && lat <= 40.5 && lng >= -6 && lng <= -3) return 'Extremadura';
  if (lat >= 39.5 && lat <= 42 && lng >= -4 && lng <= -1.5) return 'Castilla-La Mancha';
  if (lat >= 40 && lat <= 43 && lng >= -1.5 && lng <= 0.2) return 'Castilla y León';
  if (lat >= 40.5 && lat <= 43 && lng >= -3 && lng <= -1.5) return 'País Vasco';
  if (lat >= 40.5 && lat <= 43 && lng >= -1.8 && lng <= -0.2) return 'Navarra';
  if (lat >= 41.8 && lat <= 42.5 && lng >= -1.2 && lng <= 0.3) return 'La Rioja';
  if (lat >= 40.2 && lat <= 42.5 && lng >= -0.8 && lng <= 1) return 'Aragón';
  if (lat >= 40.5 && lat <= 42.5 && lng >= 0.3 && lng <= 3.5) return 'Cataluña';
  if (lat >= 42 && lat <= 43.8 && lng >= -8.5 && lng <= -6) return 'Galicia';
  if (lat >= 42.5 && lat <= 43.8 && lng >= -6.5 && lng <= -4) return 'Asturias';
  if (lat >= 43 && lat <= 44 && lng >= -4.5 && lng <= -3) return 'Cantabria';
  if (lat >= 42.5 && lat <= 43.5 && lng >= -2.5 && lng <= -1) return 'Bizkaia';
  if (lat >= 42.8 && lat <= 43.6 && lng >= -2.3 && lng <= -1.3) return 'Gipuzkoa';
  if (lat >= 42.5 && lat <= 43.2 && lng >= -2.5 && lng <= -1.5) return 'Álava';
  if (lat >= 27 && lat <= 30 && lng <= -12) return 'Islas Canarias';
  if (lat >= 35 && lat <= 38 && lng >= 2 && lng <= 5) return 'Islas Canarias';
  return 'España';
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
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data as T;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
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
      direccion: apiStation.Domicilio || '',
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
      Gasolina95E5: apiStation['Precio Gasolina 95 E5'] || null,
      Gasolina95E10: apiStation['Precio Gasolina 95 E10'] || null,
      Gasolina95E25: apiStation['Precio Gasolina 95 E25'] || null,
      Gasolina95E5Premium: apiStation['Precio Gasolina 95 E5 Premium'] || null,
      Gasolina95E85: apiStation['Precio Gasolina 95 E85'] || null,
      Gasolina98E5: apiStation['Precio Gasolina 98 E5'] || null,
      Gasolina98E10: apiStation['Precio Gasolina 98 E10'] || null,
      GasolinaRenovable: apiStation['Precio Gasolina Renovable'] || null,
      GasoleoA: apiStation['Precio Gasoleo A'] || null,
      GasoleoB: apiStation['Precio Gasoleo B'] || null,
      GasoleoPremium: apiStation['Precio Gasoleo Premium'] || null,
      Biodiesel: apiStation['Precio Biodiesel'] || null,
      DieselRenovable: apiStation['Precio Diésel Renovable'] || null,
      GasNaturalComprimido: apiStation['Precio Gas Natural Comprimido'] || null,
      GasNaturalLicuado: apiStation['Precio Gas Natural Licuado'] || null,
      BiogasNaturalComprimido: apiStation['Precio Biogas Natural Comprimido'] || null,
      BiogasNaturalLicuado: apiStation['Precio Biogas Natural Licuado'] || null,
      GasesLicuadosPetroleo: apiStation['Precio Gases licuados del petróleo'] || null,
      Adblue: apiStation['Precio Adblue'] || null,
      Amoniaco: apiStation['Precio Amoniaco'] || null,
      Bioetanol: apiStation['Precio Bioetanol'] || null,
      Hidrogeno: apiStation['Precio Hidrogeno'] || null,
      Metanol: apiStation['Precio Metanol'] || null,
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
    const stations = response.ListaEESSPrecio.map(station => this.mapApiToGasStation(station));
    this.allStationsCache = { data: stations, timestamp: now };
    return stations;
  }

  async getStationsByRadius(
    lat: number,
    lng: number,
    radiusKm: number,
    fuelType?: FuelTypeId
  ): Promise<GasStation[]> {
    const allStations = await this.getAllStations();

    let filtered = allStations
      .filter(station => {
        const stationLat = this.parseSpanishNumber(station.latitud);
        const stationLng = this.parseSpanishNumber(station.longitud);

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
      });

    if (fuelType) {
      filtered = filtered.filter(station => {
        const price = station[fuelType];
        return price !== null && price !== '';
      });
    }

    return filtered.sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
  }

  async searchWithAutoExpand(
    lat: number,
    lng: number,
    fuelType?: FuelTypeId
  ): Promise<GasStation[]> {
    const province = getProvinceFromCoords(lat, lng) || 'España';
    console.log('[API] Province detected:', province);

    let stations: GasStation[];
    if (province === 'España') {
      stations = await this.getAllStations();
    } else {
      const provinceEntry = Object.entries(PROVINCE_MAP).find(
        ([, name]) => name.toLowerCase() === province.toLowerCase()
      );
      const provinceId = provinceEntry ? provinceEntry[0] : null;

      if (provinceId) {
        console.log('[API] Fetching province:', provinceId);
        try {
          stations = await this.getStationsByProvince(provinceId);
        } catch {
          console.log('[API] Province fetch failed, falling back to all');
          stations = await this.getAllStations();
        }
      } else {
        stations = await this.getAllStations();
      }
    }
    console.log('[API] Stations to filter:', stations.length);

    for (const radius of RADII) {
      let filtered = stations
        .filter(station => {
          const stationLat = this.parseSpanishNumber(station.latitud);
          const stationLng = this.parseSpanishNumber(station.longitud);

          if (isNaN(stationLat) || isNaN(stationLng) || stationLat === 0 || stationLng === 0) {
            return false;
          }
          const distance = this.calculateDistance(lat, lng, stationLat, stationLng);
          const roadDistance = distance * DISTANCE_MULTIPLIER;
          return roadDistance <= radius;
        })
        .map(station => {
          const stationLat = this.parseSpanishNumber(station.latitud);
          const stationLng = this.parseSpanishNumber(station.longitud);
          const distance = this.calculateDistance(lat, lng, stationLat, stationLng);
          const roadDistance = Math.round(distance * DISTANCE_MULTIPLIER * 10) / 10;
          const price = fuelType ? station[fuelType] : null;
          return { ...station, distancia: roadDistance, precioBusqueda: price };
        });

      if (fuelType) {
        filtered = filtered.filter(station => {
          const price = station[fuelType];
          return price !== null && price !== '';
        });
      }

      if (filtered.length >= MAX_RESULTS || radius === RADII[RADII.length - 1]) {
        return filtered.slice(0, MAX_RESULTS).sort((a, b) => {
          const priceA = a.precioBusqueda ? this.parseSpanishNumber(a.precioBusqueda) : Infinity;
          const priceB = b.precioBusqueda ? this.parseSpanishNumber(b.precioBusqueda) : Infinity;
          if (priceA === priceB) return (a.distancia || 0) - (b.distancia || 0);
          return priceA - priceB;
        });
      }
    }

    return [];
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
