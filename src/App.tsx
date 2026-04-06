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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gasolineras España</h1>
        <p>Encuentra la gasolina más barata cerca de ti</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && (
          <div className="loading">
            <p>Buscando gasolineras...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && hasSearched && stations.length === 0 && (
          <div className="no-results">
            <p>No se encontraron gasolineras en esta zona.</p>
          </div>
        )}

        {!loading && !error && stations.length > 0 && (
          <div className="results">
            <p className="results-count">
              {stations.length} gasolineras • Mejor precio: {stations[0]?.precioBusqueda} €/L • Más
              cercana: {sortedByDistance[0]?.distancia?.toFixed(1)} km
            </p>
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
            {displayedStations.length > visibleCount && (
              <button className="show-more-btn" onClick={() => setVisibleCount(prev => prev + 4)}>
                Ver más ({displayedStations.length - visibleCount} restantes)
              </button>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="welcome">
            <p>Selecciona un tipo de combustible para buscar gasolineras cercanas.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Datos proporcionados por la API de precioil.es</p>
      </footer>
    </div>
  );
}

export default App;
