import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Explorar from './pages/Explorar';
import CadastroDador from './pages/CadastroDador';
import CadastroReceptor from './pages/CadastroReceptor';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    setIsAuthenticated(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Erro ao parsear user:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#FF9500',
        backgroundColor: '#f5f5f5'
      }}>
        ⏳ Carregando...
      </div>
    );
  }

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        user={user}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
          />
          <Route
            path="/registro"
            element={<Registro setIsAuthenticated={setIsAuthenticated} setUser={setUser} />}
          />
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
      </main>
    </Router>
  );
}


