import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

export default function Login({ setIsAuthenticated, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post('/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify({ username, first_name: username }));
      setUser({ username, first_name: username });
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>🤝 Bem-vindo de volta!</h1>
          <p style={styles.subtitle}>Faça login em sua conta DoaPerto</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Digite seu usuário"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Digite sua senha"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Não tem conta? <Link to="/registro" style={styles.link}>Crie uma agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#f5f5f5',
    padding: '2rem',
  },
  formContainer: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    padding: '2.5rem',
    maxWidth: '400px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: '1rem',
  },
  error: {
    background: '#FFE0E0',
    color: '#C00',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#333',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  },
  submitBtn: {
    background: '#FF9500',
    color: 'white',
    padding: '0.9rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #eee',
  },
  footerText: {
    color: '#666',
    fontSize: '0.95rem',
  },
  link: {
    color: '#FF9500',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

