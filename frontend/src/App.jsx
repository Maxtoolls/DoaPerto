import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CadastroDador from './pages/CadastroDador';
import CadastroReceptor from './pages/CadastroReceptor';
import Explorar from './pages/Explorar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#FF9500' }}>
        ⏳ Carregando...
      </div>
    );
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} />
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/registro" element={<Registro setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
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

