import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav style={{ background: '#FF9500', padding: '1rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
          🤝 DoaPerto
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/mapa" style={{ color: 'white', textDecoration: 'none' }}>Mapa</Link>
          {isAuthenticated ? (
            <>
              <Link to="/cadastro/doador" style={{ color: 'white', textDecoration: 'none' }}>Ser Doador</Link>
              <Link to="/cadastro/receptor" style={{ color: 'white', textDecoration: 'none' }}>Ser Receptor</Link>
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>Registrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
