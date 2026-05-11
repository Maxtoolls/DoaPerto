import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAuthenticated, setIsAuthenticated, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🤝</span> DoaPerto
        </Link>

        <div style={styles.menu}>
          <Link to="/explorar" style={styles.link}>Explorar</Link>

          {isAuthenticated ? (
            <>
              <div style={styles.userInfo}>
                <span>{user?.first_name || 'Usuário'}</span>
              </div>
              <Link to="/cadastro/doador" style={styles.link}>Ser Doador</Link>
              <Link to="/cadastro/receptor" style={styles.link}>Ser Receptor</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/registro" style={styles.registerBtn}>Registrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: '#FF9500',
    padding: '1rem 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'opacity 0.3s',
  },
  userInfo: {
    color: 'white',
    fontSize: '0.9rem',
    padding: '0.5rem 1rem',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
  },
  registerBtn: {
    background: 'white',
    color: '#FF9500',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  logoutBtn: {
    background: 'white',
    color: '#FF9500',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};

