import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function Registro({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/usuarios/', {
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
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', background: '#f5f5f5', borderRadius: '8px' }}>
      <h2>Registrar</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Usuário"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          name="first_name"
          placeholder="Nome"
          value={formData.first_name}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Sobrenome"
          value={formData.last_name}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#FF9500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrar
        </button>
      </form>
    </div>
  );
}
