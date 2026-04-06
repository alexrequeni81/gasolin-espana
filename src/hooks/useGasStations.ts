import { useState, useCallback } from 'react';
import { api } from '../services';
import type { GasStation, FuelTypeId } from '../types';

interface GasStationWithDistance extends GasStation {
  distancia?: number;
}

interface UseGasStationsResult {
  stations: GasStationWithDistance[];
  loading: boolean;
  error: string | null;
  searchByLocation: (lat: number, lng: number, fuelType?: FuelTypeId) => Promise<void>;
  refresh: () => void;
}

export function useGasStations(): UseGasStationsResult {
  const [stations, setStations] = useState<GasStationWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<{
    lat: number;
    lng: number;
    fuelType?: FuelTypeId;
  } | null>(null);

  const searchByLocation = useCallback(async (lat: number, lng: number, fuelType?: FuelTypeId) => {
    setLoading(true);
    setError(null);
    setLastParams({ lat, lng, fuelType });

    try {
      const data = await api.searchWithAutoExpand(lat, lng, fuelType);
      setStations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar gasolineras');
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    if (lastParams) {
      searchByLocation(lastParams.lat, lastParams.lng, lastParams.fuelType);
    }
  }, [lastParams, searchByLocation]);

  return { stations, loading, error, searchByLocation, refresh };
}
