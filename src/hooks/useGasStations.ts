import { useState, useCallback } from 'react';
import { api } from '../services';
import type { GasStation } from '../types';
import { getCurrentPosition } from '../utils';

interface GasStationWithDistance extends GasStation {
  distancia?: number;
}

interface UseGasStationsResult {
  stations: GasStationWithDistance[];
  loading: boolean;
  error: string | null;
  searchByLocation: (lat: number, lng: number, radiusKm: number) => Promise<void>;
  searchByCurrentLocation: (radiusKm: number) => Promise<void>;
  refresh: () => void;
}

export function useGasStations(): UseGasStationsResult {
  const [stations, setStations] = useState<GasStationWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<{ lat: number; lng: number; radius: number } | null>(
    null
  );

  const searchByLocation = useCallback(async (lat: number, lng: number, radiusKm: number) => {
    console.log('[DEBUG] searchByLocation called:', { lat, lng, radiusKm });
    setLoading(true);
    setError(null);
    setLastParams({ lat, lng, radius: radiusKm });

    try {
      console.log('[DEBUG] Calling API...');
      const data = await api.getStationsByRadius(lat, lng, radiusKm);
      console.log('[DEBUG] API returned stations:', data.length);
      console.log('[DEBUG] First station:', data[0]);
      setStations(data);
    } catch (err) {
      console.error('[DEBUG] API Error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar gasolineras');
      setStations([]);
    } finally {
      setLoading(false);
      console.log('[DEBUG] Loading finished');
    }
  }, []);

  const searchByCurrentLocation = useCallback(
    async (radiusKm: number) => {
      console.log('[DEBUG] searchByCurrentLocation called');
      try {
        const position = await getCurrentPosition();
        console.log('[DEBUG] Got position:', position.coords.latitude, position.coords.longitude);
        await searchByLocation(position.coords.latitude, position.coords.longitude, radiusKm);
      } catch (err) {
        console.error('[DEBUG] Geolocation error:', err);
        setError(err instanceof Error ? err.message : 'Error al obtener ubicación');
      }
    },
    [searchByLocation]
  );

  const refresh = useCallback(() => {
    if (lastParams) {
      searchByLocation(lastParams.lat, lastParams.lng, lastParams.radius);
    }
  }, [lastParams, searchByLocation]);

  return {
    stations,
    loading,
    error,
    searchByLocation,
    searchByCurrentLocation,
    refresh,
  };
}
