import { useState } from 'react';
import { useGasStations } from './hooks';
import { SearchBar, GasStationCard } from './components';
import './App.css';

function App() {
  const { stations, loading, error, searchByLocation } = useGasStations();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (lat: number, lng: number, radius: number) => {
    setHasSearched(true);
    await searchByLocation(lat, lng, radius);
  };

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
            <p className="results-count">{stations.length} gasolineras encontradas</p>
            <div className="stations-list">
              {stations.map(station => (
                <GasStationCard key={station.idEstacion} station={station} />
              ))}
            </div>
          </div>
        )}

        {!hasSearched && (
          <div className="welcome">
            <p>Usa el botón "Mi ubicación" para encontrar gasolineras cercanas.</p>
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
