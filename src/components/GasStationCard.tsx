import type { GasStation } from '../types';
import { formatPrice } from '../utils';

interface GasStationCardProps {
  station: GasStation & { distancia?: number };
}

export function GasStationCard({ station }: GasStationCardProps) {
  return (
    <div className="station-card">
      <div className="station-header">
        <h3 className="station-name">{station.nombreEstacion}</h3>
        {station.distancia !== undefined && (
          <span className="station-distance">{station.distancia.toFixed(1)} km</span>
        )}
      </div>
      <p className="station-address">{station.direccion}</p>
      <p className="station-location">
        {station.municipio}, {station.provincia}
      </p>
      <div className="station-prices">
        <div className="price-item">
          <span className="fuel-type">Gasolina 95</span>
          <span className="price">{formatPrice(station.precioGasolina95)} €/L</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Gasolina 98</span>
          <span className="price">{formatPrice(station.precioGasolina98)} €/L</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Diés el</span>
          <span className="price">{formatPrice(station.precioDiesel)} €/L</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Diésel+</span>
          <span className="price">{formatPrice(station.precioDieselPlus)} €/L</span>
        </div>
      </div>
      {station.horario && <p className="station-hours">Horario: {station.horario}</p>}
    </div>
  );
}
