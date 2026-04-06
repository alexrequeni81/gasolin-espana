import { useState, useCallback } from 'react';
import { api } from '../services';
import type { GasStation } from '../types';
import { calculateDistance, getCurrentPosition } from '../utils';

interface UseGasStationsResult {
  stations: GasStation[];
  loading: boolean;
  error: string | null;
  searchByLocation: (lat: number, lng: number, radiusKm: number) => Promise<void>;
  searchByCurrentLocation: (radiusKm: number) => Promise<void>;
  refresh: () => void;
}

export function useGasStations(): UseGasStationsResult {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastParams, setLastParams] = useState<{ lat: number; lng: number; radius: number } | null>(
    null
  );

  const searchByLocation = useCallback(async (lat: number, lng: number, radiusKm: number) => {
    setLoading(true);
    setError(null);
    setLastParams({ lat, lng, radius: radiusKm });

    try {
      const data = await api.getStationsByRadius(lat, lng, radiusKm);
      const stationsWithDistance = data.map(station => ({
        ...station,
        distancia: calculateDistance(
          lat,
          lng,
          parseFloat(station.latitud),
          parseFloat(station.longitud)
        ),
      }));
      stationsWithDistance.sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
      setStations(stationsWithDistance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar gasolineras');
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCurrentLocation = useCallback(
    async (radiusKm: number) => {
      try {
        const position = await getCurrentPosition();
        await searchByLocation(position.coords.latitude, position.coords.longitude, radiusKm);
      } catch (err) {
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
