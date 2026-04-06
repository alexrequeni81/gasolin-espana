export interface GasStation {
  idEstacion: number;
  nombreEstacion: string;
  marca: string;
  direccion: string;
  municipio: string;
  provincia: string;
  comunidadAutonoma: string;
  latitud: string;
  longitud: string;
  precioGasolina95: string | null;
  precioGasolina98: string | null;
  precioDiesel: string | null;
  precioDieselPlus: string | null;
  precioGas: string | null;
  horario: string;
  fechaActualizacion: string;
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
