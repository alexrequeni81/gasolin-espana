import type { GasStation, FuelTypeId } from '../types';
import { formatPrice } from '../utils';

interface GasStationCardProps {
  station: GasStation & { distancia?: number };
  selectedFuel?: FuelTypeId;
  isCheapest?: boolean;
  isClosest?: boolean;
}

export function GasStationCard({
  station,
  selectedFuel,
  isCheapest,
  isClosest,
}: GasStationCardProps) {
  const fuelKey = selectedFuel || 'GasoleoA';
  const price = station[fuelKey as keyof GasStation] as string | null;
  const formattedPrice = formatPrice(price);
  const isAvailable = formattedPrice !== '-';

  return (
    <div className={`station-card${isCheapest ? ' cheapest' : ''}${isClosest ? ' closest' : ''}`}>
      <div className="station-badges">
        {isCheapest && <span className="badge cheapest">★ Mejor precio</span>}
        {isClosest && <span className="badge closest">📍 Más cercana</span>}
      </div>

      <div className="station-header">
        <h3 className="station-name">{station.nombreEstacion}</h3>
        {station.distancia !== undefined && (
          <span className="station-distance">{station.distancia.toFixed(1)} km</span>
        )}
      </div>

      <p className="station-address">{station.direccion}</p>

      {isAvailable && (
        <div className="station-price-section">
          <div className="price-display">
            <span className="price-value">{formattedPrice}</span>
            <span className="price-unit">€/L</span>
          </div>
        </div>
      )}

      <div className="station-actions">
        <a
          href={`https://www.google.com/maps/?q=${station.latitud.replace(',', '.')},${station.longitud.replace(',', '.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          🚗 Navegar
        </a>
      </div>
    </div>
  );
}
