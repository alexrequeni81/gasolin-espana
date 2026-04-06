import { useState, useCallback } from 'react';
import { getCurrentPosition } from '../utils';

interface SearchBarProps {
  onSearch: (lat: number, lng: number, radius: number) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [radius, setRadius] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const handleCurrentLocation = useCallback(async () => {
    setError(null);
    try {
      const position = await getCurrentPosition();
      onSearch(position.coords.latitude, position.coords.longitude, radius);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso de ubicación denegado. Actívala en tu navegador.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Ubicación no disponible.');
            break;
          case err.TIMEOUT:
            setError('Tiempo de espera de ubicación agotado.');
            break;
        }
      } else {
        setError('Error al obtener ubicación');
      }
    }
  }, [onSearch, radius]);

  return (
    <div className="search-bar">
      <div className="search-row">
        <label className="radius-label">
          Radio de búsqueda:
          <select
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className="radius-select"
          >
            <option value={1}>1 km</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
          </select>
        </label>
        <button onClick={handleCurrentLocation} disabled={loading} className="location-btn">
          {loading ? 'Buscando...' : 'Mi ubicación'}
        </button>
      </div>
      {error && <p className="search-error">{error}</p>}
    </div>
  );
}
