import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CadastroDador from './pages/CadastroDador';
import CadastroReceptor from './pages/CadastroReceptor';
import MapView from './pages/MapView';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/registro" element={<Registro setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/mapa" element={<MapView />} />
        <Route
          path="/cadastro/doador"
          element={<PrivateRoute><CadastroDador /></PrivateRoute>}
        />
        <Route
          path="/cadastro/receptor"
          element={<PrivateRoute><CadastroReceptor /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
