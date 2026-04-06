import { useState, useMemo } from 'react';
import { useGasStations } from './hooks';
import { SearchBar, GasStationCard } from './components';
import type { FuelTypeId } from './types';
import './App.css';

function App() {
  const { stations, loading, error, searchByLocation } = useGasStations();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState<FuelTypeId | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(4);

  const handleSearch = async (lat: number, lng: number, fuelType?: FuelTypeId) => {
    setHasSearched(true);
    setSelectedFuel(fuelType);
    setVisibleCount(4);
    await searchByLocation(lat, lng, fuelType);
  };

  const sortedByDistance = useMemo(() => {
    return [...stations].sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
  }, [stations]);

  const displayedStations = useMemo(() => {
    if (stations.length === 0) return [];
    const cheapest = stations[0];
    const closestOther = sortedByDistance.find(s => s.idEstacion !== cheapest.idEstacion) || null;

    const others = stations.filter(
      s => s.idEstacion !== cheapest.idEstacion && s.idEstacion !== closestOther?.idEstacion
    );

    const result = [cheapest];
    if (closestOther) result.push(closestOther);
    return [...result, ...others];
  }, [stations, sortedByDistance]);

  const cheapestPrice = stations[0]?.precioBusqueda || '-';
  const closestDistance = sortedByDistance[0]?.distancia?.toFixed(1) || '-';

  return (
    <div className="app">
      <header className="app-header">
        <h1>⛽ Gasolineras España</h1>
        <p>Encuentra el combustible más barato cerca de ti</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {!loading && !error && stations.length > 0 && (
          <div className="results-header">
            <p className="results-count">
              {stations.length} {stations.length === 1 ? 'gasolinera' : 'gasolineras'} encontradas
            </p>
            <div className="results-summary">
              <span className="summary-item">
                <span className="summary-dot price"></span>
                {cheapestPrice} €/L
              </span>
              <span className="summary-item">
                <span className="summary-dot location"></span>
                {closestDistance} km
              </span>
            </div>
          </div>
        )}

        {!loading && !error && stations.length > 0 && (
          <div className="stations-list">
            {displayedStations.slice(0, visibleCount).map(station => {
              const isCheapest = station.idEstacion === stations[0]?.idEstacion;
              const isClosest =
                station.idEstacion === sortedByDistance[0]?.idEstacion && !isCheapest;
              return (
                <GasStationCard
                  key={station.idEstacion}
                  station={station}
                  selectedFuel={selectedFuel}
                  isCheapest={isCheapest}
                  isClosest={isClosest}
                />
              );
            })}
          </div>
        )}

        {!loading && !error && displayedStations.length > visibleCount && (
          <button className="show-more-btn" onClick={() => setVisibleCount(prev => prev + 4)}>
            Ver más ({displayedStations.length - visibleCount} gasolineras)
          </button>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text-full">Buscando gasolineras...</p>
            <p className="loading-subtext">
              Detectando tu ubicación y buscando los mejores precios
            </p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && hasSearched && stations.length === 0 && (
          <div className="no-results">
            <span className="welcome-icon">🔍</span>
            <p>No se encontraron gasolineras en esta zona. Intenta ampliar el radio de búsqueda.</p>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="welcome">
            <span className="welcome-icon">⛽</span>
            <p>
              Selecciona un tipo de combustible para encontrar las gasolineras más cercanas con los
              mejores precios.
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Datos oficiales del Ministerio de Energía • Actualizado recientemente</p>
      </footer>
    </div>
  );
}

export default App;
