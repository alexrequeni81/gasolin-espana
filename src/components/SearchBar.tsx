import { useState, useCallback } from 'react';
import { getCurrentPosition } from '../utils';
import { FUEL_TYPES, type FuelTypeId } from '../types';

interface SearchBarProps {
  onSearch: (lat: number, lng: number, fuelType?: FuelTypeId) => void;
  loading?: boolean;
}

const FUEL_CATEGORIES = [
  { id: 'gasolina', name: 'Gasolina' },
  { id: 'gasoleo', name: 'Gasóleo' },
  { id: 'gnc', name: 'GNC/GNL' },
  { id: 'glp', name: 'GLP' },
  { id: 'otros', name: 'Otros' },
];

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [fuelType, setFuelType] = useState<FuelTypeId | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleFuelChange = useCallback(
    (value: FuelTypeId | '') => {
      setFuelType(value);
      if (value) {
        setError(null);
        getCurrentPosition()
          .then(position => onSearch(position.coords.latitude, position.coords.longitude, value))
          .catch(err => {
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
          });
      }
    },
    [onSearch]
  );

  return (
    <div className="search-bar">
      <label className="fuel-label">
        Selecciona combustible:
        <select
          value={fuelType}
          onChange={e => handleFuelChange(e.target.value as FuelTypeId | '')}
          className="fuel-select"
          disabled={loading}
        >
          <option value="">Selecciona...</option>
          {FUEL_CATEGORIES.map(cat => (
            <optgroup key={cat.id} label={cat.name}>
              {FUEL_TYPES.filter(f => f.category === cat.id).map(fuel => (
                <option key={fuel.id} value={fuel.id}>
                  {fuel.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      {error && <p className="search-error">{error}</p>}
      {loading && <p className="loading-text">Buscando gasolineras...</p>}
    </div>
  );
}
