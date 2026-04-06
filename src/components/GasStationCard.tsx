import type { GasStation, FuelTypeId } from '../types';
import { formatPrice } from '../utils';

interface GasStationCardProps {
  station: GasStation & { distancia?: number };
  selectedFuel?: FuelTypeId;
  isCheapest?: boolean;
  isClosest?: boolean;
}

const FUEL_LABELS: Record<string, string> = {
  Gasolina95E5: 'Gasolina 95',
  Gasolina95E10: 'Gasolina 95 E10',
  Gasolina95E25: 'Gasolina 95 E25',
  Gasolina95E5Premium: 'Gasolina 95 Premium',
  Gasolina95E85: 'Gasolina 95 E85',
  Gasolina98E5: 'Gasolina 98',
  Gasolina98E10: 'Gasolina 98 E10',
  GasolinaRenovable: 'Gasolina Renovable',
  GasoleoA: 'Diésel',
  GasoleoB: 'Diiesel B',
  GasoleoPremium: 'Diiesel Premium',
  Biodiesel: 'Biodiesel',
  DieselRenovable: 'Diiesel Renovable',
  GasNaturalComprimido: 'GNC',
  GasNaturalLicuado: 'GNL',
  BiogasNaturalComprimido: 'Biogas GNC',
  BiogasNaturalLicuado: 'Biogas GNL',
  GasesLicuadosPetroleo: 'GLP',
  Adblue: 'Adblue',
  Amoniaco: 'Amoniaco',
  Bioetanol: 'Bioetanol',
  Hidrogeno: 'Hidrógeno',
  Metanol: 'Metanol',
};

export function GasStationCard({
  station,
  selectedFuel,
  isCheapest,
  isClosest,
}: GasStationCardProps) {
  const prices = selectedFuel
    ? [
        {
          label: FUEL_LABELS[selectedFuel] || selectedFuel,
          price: formatPrice(station[selectedFuel as keyof GasStation] as string | null),
        },
      ]
    : Object.entries(FUEL_LABELS)
        .map(([key, label]) => ({
          label,
          price: formatPrice(station[key as keyof GasStation] as string | null),
        }))
        .filter(p => p.price !== '-');

  return (
    <div className={`station-card${isCheapest ? ' cheapest' : ''}${isClosest ? ' closest' : ''}`}>
      {isCheapest && <span className="cheapest-badge">Mejor precio</span>}
      {isClosest && <span className="closest-badge">Más cercana</span>}
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
        {prices.map((p, i) => (
          <div key={i} className="price-item">
            <span className="fuel-type">{p.label}</span>
            <span className="price">{p.price} €/L</span>
          </div>
        ))}
      </div>
      {station.horario && <p className="station-hours">Horario: {station.horario}</p>}
      <a
        href={`https://www.google.com/maps/?q=${station.latitud.replace(',', '.')},${station.longitud.replace(',', '.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="map-link"
      >
        📍 Ver en Maps
      </a>
    </div>
  );
}
