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
        {station.localidad}, {station.provincia}
      </p>
      <div className="station-prices">
        <div className="price-item">
          <span className="fuel-type">Gasolina 95</span>
          <span className="price">{formatPrice(station.Gasolina95)} €/L</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Gasolina 98</span>
          <span className="price">{formatPrice(station.Gasolina98)} €/L</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Diés el</span>
          <span className="price">{formatPrice(station.Diesel)} €/L</span>
        </div>
        <div className="price-item">
          <span className="fuel-type">Diés el+</span>
          <span className="price">{formatPrice(station.DieselPremium)} €/L</span>
        </div>
      </div>
      {station.horario && <p className="station-hours">Horario: {station.horario}</p>}
    </div>
  );
}
