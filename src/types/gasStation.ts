export interface GasStation {
  idEstacion: number;
  nombreEstacion: string;
  marca: string;
  direccion: string;
  localidad: string;
  codPostal: string;
  municipio: string;
  provincia: string;
  provinciaDistrito: string;
  latitud: string;
  longitud: string;
  horario: string;
  margen: string;
  tipoVenta: string;
  Gasolina95E5: string | null;
  Gasolina95E10: string | null;
  Gasolina95E25: string | null;
  Gasolina95E5Premium: string | null;
  Gasolina95E85: string | null;
  Gasolina98E5: string | null;
  Gasolina98E10: string | null;
  GasolinaRenovable: string | null;
  GasoleoA: string | null;
  GasoleoB: string | null;
  GasoleoPremium: string | null;
  Biodiesel: string | null;
  DieselRenovable: string | null;
  GasNaturalComprimido: string | null;
  GasNaturalLicuado: string | null;
  BiogasNaturalComprimido: string | null;
  BiogasNaturalLicuado: string | null;
  GasesLicuadosPetroleo: string | null;
  Adblue: string | null;
  Amoniaco: string | null;
  Bioetanol: string | null;
  Hidrogeno: string | null;
  Metanol: string | null;
  lastUpdate: string;
  distancia?: number;
  precioBusqueda?: string | null;
}

export const FUEL_TYPES = [
  { id: 'Gasolina95E5', name: 'Gasolina 95 E5', category: 'gasolina' },
  { id: 'Gasolina95E10', name: 'Gasolina 95 E10', category: 'gasolina' },
  { id: 'Gasolina95E25', name: 'Gasolina 95 E25', category: 'gasolina' },
  { id: 'Gasolina95E5Premium', name: 'Gasolina 95 E5 Premium', category: 'gasolina' },
  { id: 'Gasolina95E85', name: 'Gasolina 95 E85', category: 'gasolina' },
  { id: 'Gasolina98E5', name: 'Gasolina 98 E5', category: 'gasolina' },
  { id: 'Gasolina98E10', name: 'Gasolina 98 E10', category: 'gasolina' },
  { id: 'GasolinaRenovable', name: 'Gasolina Renovable', category: 'gasolina' },
  { id: 'GasoleoA', name: 'Gasoleo A', category: 'gasoleo' },
  { id: 'GasoleoB', name: 'Gasoleo B', category: 'gasoleo' },
  { id: 'GasoleoPremium', name: 'Gasoleo Premium', category: 'gasoleo' },
  { id: 'Biodiesel', name: 'Biodiesel', category: 'gasoleo' },
  { id: 'DieselRenovable', name: 'Diésel Renovable', category: 'gasoleo' },
  { id: 'GasNaturalComprimido', name: 'GNC', category: 'gnc' },
  { id: 'GasNaturalLicuado', name: 'GNL', category: 'gnc' },
  { id: 'BiogasNaturalComprimido', name: 'Biogas Comprimido', category: 'gnc' },
  { id: 'BiogasNaturalLicuado', name: 'Biogas Licuado', category: 'gnc' },
  { id: 'GasesLicuadosPetroleo', name: 'GLP', category: 'glp' },
  { id: 'Adblue', name: 'Adblue', category: 'otros' },
  { id: 'Amoniaco', name: 'Amoniaco', category: 'otros' },
  { id: 'Bioetanol', name: 'Bioetanol', category: 'otros' },
  { id: 'Hidrogeno', name: 'Hidrógeno', category: 'otros' },
  { id: 'Metanol', name: 'Metanol', category: 'otros' },
] as const;

export type FuelTypeId = (typeof FUEL_TYPES)[number]['id'];

export interface GasStationDetails extends GasStation {
  servicios: string[];
  tiposCombustible: FuelType[];
}

export interface FuelType {
  idFuelType: number;
  fuelTypeName: string;
  precio: string | null;
}

export interface PriceChange {
  idEstacion: number;
  nombreEstacion: string;
  tipoCombustible: string;
  precioAnterior: string;
  precioNuevo: string;
  fechaCambio: string;
}

export interface SearchParams {
  latitud: number;
  longitud: number;
  radioKm: number;
  tipoCombustible?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
