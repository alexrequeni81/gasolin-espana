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
  Gasolina95: string | null;
  Gasolina95_media: string | null;
  Gasolina98: string | null;
  Gasolina98_media: string | null;
  Diesel: string | null;
  Diesel_media: string | null;
  DieselPremium: string | null;
  DieselPremium_media: string | null;
  DieselB_media: string | null;
  GLP_media: string | null;
  HVO_media: string | null;
  lastUpdate: string;
  distancia?: number;
}

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
