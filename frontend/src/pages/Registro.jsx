import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';

export default function Registro({ setIsAuthenticated, setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/usuarios/', {
        user: formData,
        tipo: 'doador',
        aceite_termos: true,
      });

      const loginResponse = await apiClient.post('/token/', {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem('access_token', loginResponse.data.access);
      localStorage.setItem('refresh_token', loginResponse.data.refresh);
      localStorage.setItem('user', JSON.stringify({
        username: formData.username,
        first_name: formData.first_name
      }));

      setUser({ username: formData.username, first_name: formData.first_name });
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>🤝 Crie sua conta</h1>
          <p style={styles.subtitle}>Junte-se à comunidade DoaPerto</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="João"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Sobrenome</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Silva"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="joaosilva"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="joao@exemplo.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Já tem conta? <Link to="/login" style={styles.link}>Faça login aqui</Link>
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
    maxWidth: '450px',
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
    gap: '1rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
    marginTop: '0.5rem',
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

