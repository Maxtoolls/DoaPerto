import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import apiClient from '../api/client';

export default function MapView() {
  const [pontos, setPontos] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [km, setKm] = useState(10);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
      fetchPontos(latitude, longitude);
    });
  }, []);

  const fetchPontos = async (lat, lon) => {
    try {
      const response = await apiClient.get(`/pontos-coleta/proximos/?lat=${lat}&lon=${lon}&km=${km}`);
      setPontos(response.data);
    } catch (err) {
      console.error('Erro ao buscar pontos', err);
    }
  };

  const handleKmChange = () => {
    if (userLocation) {
      fetchPontos(userLocation[0], userLocation[1]);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Pontos de Coleta Próximos</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Distância: {km}km
          <input
            type="range"
            min="1"
            max="50"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            onMouseUp={handleKmChange}
            style={{ marginLeft: '1rem' }}
          />
        </label>
      </div>

      {userLocation && (
        <MapContainer center={userLocation} zoom={13} style={{ height: '500px', borderRadius: '8px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={userLocation} title="Sua localização">
            <Popup>Você está aqui</Popup>
          </Marker>
          {pontos.map((p, idx) => (
            <Marker key={idx} position={[parseFloat(p.ponto.latitude), parseFloat(p.ponto.longitude)]}>
              <Popup>
                <div>
                  <strong>{p.ponto.nome}</strong>
                  <p>{p.ponto.endereco}</p>
                  <p>Distância: {p.distancia_km}km</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Pontos Encontrados: {pontos.length}</h3>
        {pontos.map((p) => (
          <div key={p.ponto.id} style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
            <h4>{p.ponto.nome}</h4>
            <p>{p.ponto.endereco}</p>
            <p><strong>Tipo:</strong> {p.ponto.tipo}</p>
            <p><strong>Distância:</strong> {p.distancia_km}km</p>
          </div>
        ))}
      </div>
    </div>
  );
}
